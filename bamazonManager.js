//require
require('dotenv').config();
const mysql = require("mysql");
const inquirer = require("inquirer");
const colors = require("colors");
const keys = require('./keys');
const Joi = require("joi");

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

//start app
function startApp() {
    console.log('\n');
    console.log('\n');
    console.log('--------------------'.blue);
    console.log('\n');
    console.log("Welcome manager.".blue);
    console.log('\n');
    console.log('--------------------'.blue);
    console.log('\n');
    console.log('\n');

    //password validation ------------
    //     inquirer.prompt({
    //         name: "code",
    //         type: "input",
    //         message: "Enter your four digit manager code.".red,
    //         validate: validatePassword
    //     }).then(function (answer) {
    //         if (validatePassword === true) {
    //             let blah = answer.code
    //             displayOptions(blah);

    //         } else {
    //             console.log("invalid code".red)
    //             connection.end();
    //         }
    //     });
    // }

    // function displayOptions(blah) {
    //     console.log("It's working");
    //     console.log(blah);

    //     connection.end();
    // }
    //password validation ------------
    promptOptions();
}

//app menu with switch function
function promptOptions() {
    //prompt user
    inquirer.prompt({
        name: "menu",
        type: "list",
        message: "What would you like to do?",
        choices: ["View Products for Sale".yellow, "View Low Inventory".blue, "Add to Inventory".green, "Add New Product".magenta, "Exit".red]
    }).then(function (answer) {
        //switch function
        switch (answer.menu) {
            case "View Products for Sale".yellow:
                queryAll();
                break;

            case "View Low Inventory".blue:
                queryLow();
                break;

            case "Add to Inventory".green:
                displayAll();
                break;

            case "Add New Product".magenta:
                addItem();
                break;

            case "Exit".red:
                endApp();
                break;
        }
    });
}

//validate integer
function validateInt(num) {
    const reg = /^\d+$/;
    return reg.test(num) || "Please enter a valid ID.".red;
}

//add new item
function addItem() {
    // prompt user to grab item name, department, price, quantity
    inquirer.prompt([
        {
            name: "item",
            type: "input",
            message: "What is the item you would like to submit?"
        },
        {
            name: "department",
            type: "input",
            message: "What department would you like to add your item to?"
        },
        {
            name: "price",
            type: "input",
            message: "What is the stock price?",
            //validate that price and quantity are valid numbers
            validate: function (num) {
                if (isNaN(num) === false) {
                    return true;
                }
                return "Not a valid price.";
            }
        },
        {
            name: "quantity",
            type: "input",
            message: "Enter a quantity.",
            validate: function (num) {
                if (isNaN(num) === false) {
                    return true;
                }
                return "Not a valid  quantity.";
            }
        }
    ]).then(function (answer) {
        // insert into database and loop app to start
        let insert = "INSERT INTO products SET ?";
        connection.query(insert, { product_name: answer.item, department_name: answer.department, price: answer.price, stock_quantity: answer.quantity }, function (err) {
            if (err) throw err;
            console.log('\n');
            console.log('--------------------'.blue);
            console.log("Product restock successful".blue);
            console.log('--------------------'.blue);
            console.log('\n');
            promptOptions();
        });
    });
}

//add stock quantity
function addStock() {
    // prompt for item
    inquirer.prompt([
        {
            name: "idInput",
            type: "input",
            validate: validateInt,
            message: "Enter the ID # of the item you want to restock.".blue
        }
    ]).then(function (answer) {
        // item id cant be 0
        if (answer.idInput === "0") {
            console.log('--------------------'.blue);
            console.log('\n');
            console.log("Please enter a valid ID!".blue);
            console.log('\n');
            console.log('--------------------'.blue);
            addItem();
        } else {
            // prompt for quantity 
            inquirer.prompt([
                {
                    name: "quantity",
                    type: "input",
                    validate: validateInt,
                    message: "How many of this item would you like to add?".blue
                }
            ]).then(function (ans) {
                // cant be 0
                if (ans.quantity === "0") {
                    console.log('--------------------'.blue);
                    console.log('\n');
                    console.log("Please enter a valid quantity!".blue);
                    console.log('\n');
                    console.log('--------------------'.blue);
                    addItem();
                } else {
                    // grab answer ID and pull from database
                    let select = "SELECT products.product_name, products.price, products.stock_quantity FROM products WHERE ?";
                    connection.query(select, [{ item_id: answer.idInput }], function (err, res) {
                        if (err) throw err;
                        // grab quantity
                        let newQuantity = res[0].stock_quantity;
                        // update query
                        let update = "UPDATE products SET ? WHERE ?";
                        console.log('--------------------'.blue);
                        console.log('\n');
                        console.log("Stock Quantity:".red)
                        console.log(newQuantity);
                        // add user quantity to stock quantity
                        newQuantity += parseInt(ans.quantity);
                        console.log('--------------------'.blue);
                        console.log("Stock Quantity after Update:".green)
                        console.log(newQuantity);
                        // update database
                        connection.query(update, [{ stock_quantity: newQuantity }, { item_id: answer.idInput }], function (err, res) {
                            if (err) throw err;
                            // alert user
                            console.log('--------------------'.blue);
                            console.log("Product restock successful".blue);
                            console.log('--------------------'.blue);
                            console.log('\n');
                            // loop
                            promptOptions();
                        });
                    });
                }
            });
        }
    });
}

//display low quantity items
function queryLow() {
    // find items in database
    let select = "SELECT products.item_id, products.product_name, products.price, products.stock_quantity FROM products WHERE stock_quantity < 5";
    connection.query(select, function (err, res) {

        if (err) throw err;
        // console.log(res);

        //display products
        for (let i = 0; i < res.length; i++) {

            console.log('\n');
            console.log('-------------------------------------------------------------------------------------------------------------------------------------'.blue);
            console.log("ID: " + res[i].item_id + " | " + "Quantity: " + res[i].stock_quantity + " | " + "Product: " + res[i].product_name + " | " + "Price: " + res[i].price);
            console.log('-------------------------------------------------------------------------------------------------------------------------------------'.blue);
            console.log('\n');

        }
        //trigger prompt
        promptOptions();
    });
}

//display all item function for add item function
function displayAll() {
    // pull from database
    let select = "SELECT * FROM products";
    connection.query(select, function (err, res) {

        if (err) throw err;
        // console.log(res);

        //display products
        for (let i = 0; i < res.length; i++) {

            console.log('\n');
            console.log('--------------------------------------------------------------------------------------------------------------------------------------------------'.blue);
            console.log("ID: " + res[i].item_id + " | " + "Quantity: " + res[i].stock_quantity + " | " + "Product: " + res[i].product_name + " | " + "Price: " + res[i].price);
            console.log('--------------------------------------------------------------------------------------------------------------------------------------------------'.blue);
            console.log('\n');

        }
        //add function
        addStock();
    });
}

//display all items from user query
function queryAll() {
    // pull from database
    let select = "SELECT * FROM products";
    connection.query(select, function (err, res) {

        if (err) throw err;
        // console.log(res);

        //display products
        for (let i = 0; i < res.length; i++) {

            console.log('\n');
            console.log('--------------------------------------------------------------------------------------------------------------------------------------------------'.blue);
            console.log("ID: " + res[i].item_id + " | " + "Quantity: " + res[i].stock_quantity + " | " + "Product: " + res[i].product_name + " | " + "Price: " + res[i].price);
            console.log('--------------------------------------------------------------------------------------------------------------------------------------------------'.blue);
            console.log('\n');

        }
        //trigger prompt
        promptOptions();
    });

}

//exit option
function endApp() {
    console.log('\n');
    console.log('\n');
    console.log('--------------------'.blue);
    console.log('\n');
    console.log("Keep up the good work manager!".america);
    console.log('\n');
    console.log('--------------------'.blue);
    console.log('\n');
    console.log('\n');
    connection.end();
}



//password validation code --------
// function validatePassword(code) {
//     var schema = Joi.number().integer().min(1000).max(9999);
//     var result = Joi.validate(code, schema);
//     return result.err ? result.err.message : true;
// }
//password validation code -------

