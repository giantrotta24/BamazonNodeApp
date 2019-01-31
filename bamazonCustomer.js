//require
require('dotenv').config();
const mysql = require("mysql");
const inquirer = require("inquirer");
const colors = require("colors");
const keys = require('./keys');


//create connection to database
const connection = mysql.createConnection({
    host: "localhost",

    port: 3306,

    user: "root",

    password: keys.sql.password,
    database: "bamazon_DB"
});

//connect to database
connection.connect(function (err) {
    if (err) throw err;
    //no error then start app
    startApp();
});

//greet user
function startApp() {
    console.log('\n');
    console.log('\n');
    console.log('--------------------'.red);
    console.log('\n');
    console.log("Welcome to Bamazon™".red);
    console.log('\n');
    console.log('--------------------'.red);
    console.log('\n');
    console.log('\n');
    //prompt user
    userPrompt();

}

//list options
function userPrompt() {
    inquirer.prompt({
        name: "menu",
        type: "list",
        message: "What would you like to do?",
        choices: ["Shop".yellow, "Exit".red]
    }).then(function (answer) {
        //switch function
        switch (answer.menu) {
            case "Shop".yellow:
                shop();
                break;

            case "Exit".red:
                endApp();
                break;
        }
    });
}

//If user selects the shop option
function shop() {
    //select department
    inquirer.prompt({
        name: "department",
        type: "list",
        message: "Select a department",
        choices: ["Groceries".yellow, "Personal Care".blue, "Entertainment".magenta, "View All".green, "Back to Menu".red]
    }).then(function (response) {
        //switch function
        switch (response.department) {
            case "Groceries".yellow:
                groceries();
                break;

            case "Personal Care".blue:
                personalCare();
                break;

            case "Entertainment".magenta:
                entertainment();
                break;

            case "View All".green:
                queryAll();
                break;

            case "Back to Menu".red:
                userPrompt();
                break;
        }
    });

}

//validate integer
function validateInt(num) {
    const reg = /^\d+$/;
    return reg.test(num) || "Please enter a valid ID.".red;
}

//display all items and trigger purchase prompt
function queryAll() {
    let select = "SELECT * FROM products";
    connection.query(select, function (err, res) {

        if (err) throw err;
        // console.log(res);

        //display products
        for (let i = 0; i < res.length; i++) {

            console.log('\n');
            console.log('--------------------------------------------------------------------------------------------------------------------------------------------------'.red);
            console.log("ID: " + res[i].item_id + " | " + "Quantity: " + res[i].stock_quantity + " | " + "Product: " + res[i].product_name + " | " + "Price: " + res[i].price);
            console.log('--------------------------------------------------------------------------------------------------------------------------------------------------'.red);
            console.log('\n');

        }
        //trigger purchase prompt
        userPurchase();
    });

}

//purchase prompt
function userPurchase() {

    inquirer.prompt([
        {
            name: "idInput",
            type: "input",
            validate: validateInt,
            message: "Enter the ID # of the item you want to purchase.".red
        }
    ]).then(function (answer) {
        // 0 is not valid
        if (answer.idInput === "0") {
            console.log('--------------------'.red);
            console.log('\n');
            console.log("Please enter a valid ID!".red);
            console.log('\n');
            console.log('--------------------'.red);
            userPurchase();
        } else {
            //prompt quantity 
            inquirer.prompt([
                {
                    name: "quantity",
                    type: "input",
                    validate: validateInt,
                    message: "How many of this item would you like to purchase?".red
                }
            ]).then(function (ans) {
                // 0 is not valid
                if (ans.quantity === "0") {
                    console.log('--------------------'.red);
                    console.log('\n');
                    console.log("Please enter a valid quantity!".red);
                    console.log('\n');
                    console.log('--------------------'.red);
                    userPurchase();
                } else {
                    //select prom database based on user input ID
                    let select = "SELECT products.product_name, products.price, products.stock_quantity, products.product_sales FROM products WHERE ?";
                    connection.query(select, [{ item_id: parseInt(answer.idInput) }], function (err, res) {
                        if (err) throw err;
                        // if sold out display sold out
                        if (res[0].stock_quantity === 0) {
                            console.log('--------------------'.red);
                            console.log('\n');
                            console.log("Insufficient quantity. Product is SOLD OUT".red);
                            console.log('\n');
                            console.log('--------------------'.red);
                            userPurchase();
                            // insufficient quantity
                        } else if (ans.quantity > res[0].stock_quantity) {
                            console.log('--------------------'.red);
                            console.log('\n');
                            console.log("Insufficient quantity. We currently only have ".red + res[0].stock_quantity + " of that product in stock.".red);
                            console.log('\n');
                            console.log('--------------------'.red);
                            userPurchase();
                        } 
                        else {
                            //update database stock quantity, total sales, and display cost to user
                            let newQuantity = res[0].stock_quantity;
                            newQuantity -= ans.quantity;
                            let cost = res[0].price;
                            let totalCost = ans.quantity * cost;
                            let sales = res[0].product_sales;
                            // console.log(sales);
                            sales += totalCost;
                            // console.log(sales.toFixed(2));
                            //update database
                            let update = "UPDATE products SET ? WHERE ?";
                            connection.query(update, [{ stock_quantity: newQuantity, product_sales: sales.toFixed(2) }, { item_id: answer.idInput }], function (err, res) {
                                if (err) throw err;
                                console.log('--------------------'.green);
                                console.log('\n');
                                console.log("Your total cost is $".green + totalCost.toFixed(2).green + ".".green);
                                inquirer.prompt([
                                    {
                                        name: "confirm",
                                        type: "list",
                                        message: "What's next?",
                                        choices: ["Keep Shopping".green, "Exit".red]
                                    }
                                ]).then(function (con) {
                                    switch (con.confirm) {
                                        case "Keep Shopping".green:
                                            shop();
                                            break;
                            
                                        case "Exit".red:
                                            endApp();
                                            break;
                                    }
                                });
                            });
                        }
                    });
                }
            });
        }
    });
}

//display based on department then prompt shop
function groceries() {
    let select = "SELECT products.item_id, products.stock_quantity, products.product_name, products.price FROM products WHERE ?";
    connection.query(select, [{ department_name: "Grocery" }], function (err, res) {

        if (err) throw err;
        // console.log(res);

        //display products
        for (let i = 0; i < res.length; i++) {

            console.log('\n');
            console.log('--------------------------------------------------------------------------------------------------------------------------------------------------'.red);
            console.log("ID: " + res[i].item_id + " | " + "Quantity: " + res[i].stock_quantity + " | " + "Product: " + res[i].product_name + " | " + "Price: " + res[i].price);
            console.log('--------------------------------------------------------------------------------------------------------------------------------------------------'.red);
            console.log('\n');

        }
        //trigger purchase prompt
        userPurchase();
    });
}

function personalCare() {
    let select = "SELECT products.item_id, products.stock_quantity, products.product_name, products.price FROM products WHERE ?";
    connection.query(select, [{ department_name: "Personal Care" }], function (err, res) {

        if (err) throw err;
        // console.log(res);

        //display products
        for (let i = 0; i < res.length; i++) {

            console.log('\n');
            console.log('--------------------------------------------------------------------------------------------------------------------------------------------------'.red);
            console.log("ID: " + res[i].item_id + " | " + "Quantity: " + res[i].stock_quantity + " | " + "Product: " + res[i].product_name + " | " + "Price: " + res[i].price);
            console.log('--------------------------------------------------------------------------------------------------------------------------------------------------'.red);
            console.log('\n');

        }
        //trigger purchase prompt
        userPurchase();
    });
}

function entertainment() {
    let select = "SELECT products.item_id, products.stock_quantity, products.product_name, products.price FROM products WHERE ?";
    connection.query(select, [{ department_name: "Entertainment" }], function (err, res) {

        if (err) throw err;
        // console.log(res);

        //display products
        for (let i = 0; i < res.length; i++) {

            console.log('\n');
            console.log('--------------------------------------------------------------------------------------------------------------------------------------------------'.red);
            console.log("ID: " + res[i].item_id + " | " + "Quantity: " + res[i].stock_quantity + " | " + "Product: " + res[i].product_name + " | " + "Price: " + res[i].price);
            console.log('--------------------------------------------------------------------------------------------------------------------------------------------------'.red);
            console.log('\n');

        }
        //trigger purchase prompt
        userPurchase();
    });
}

//exit option
function endApp() {
    console.log('\n');
    console.log('\n');
    console.log('--------------------'.red);
    console.log('\n');
    console.log("Thank you for shopping with Bamazon™".america);
    console.log('\n');
    console.log('--------------------'.red);
    console.log('\n');
    console.log('\n');
    connection.end();
}