//require
require('dotenv').config();
const mysql = require("mysql");
const inquirer = require("inquirer");
const colors = require("colors");
const keys = require('./keys');
const { table } = require('table');

//make table function
function makeTable(data) {
    // array containing array of first table row
    const tableRow = [["Item ID", "Department Name", "Product Name", "Stock Quantity", "Stock Price", "Product Sales"]];

    //for each loop, for each element of data push corresponding data array into table array
    data.forEach(element => {
        tableRow.push([element.item_id, element.department_name, element.product_name, element.stock_quantity, "$" + element.price, "$" + element.product_sales])
    });
    // push table created with data
    return table(tableRow);
}

//show table function
function showTable() {
    //query database
    let select = "SELECT * FROM products";
    connection.query(select, function (err, res) {
        if (err) throw err;
        // res from query = data defined in maketable function
        // log the function return
        console.log(makeTable(res));
        // end the connection
        connection.end();
    });
}

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
    console.log('--------------------'.green);
    console.log('\n');
    console.log("Welcome Bamazon™ supervisor.".green);
    console.log('\n');
    console.log('--------------------'.green);
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
        choices: ["View Product Sales by Department".yellow, "Create New Department".blue, "View Low Inventory".cyan, "Add to Inventory".green, "Add New Product".magenta, "Exit".red]
    }).then(function (answer) {
        //switch function
        switch (answer.menu) {
            case "View Product Sales by Department".yellow:
                showTable();
                break;

            case "Create New Department".blue:
                console.log("nothing yet.");
                connection.end();
                break;

            case "View Low Inventory".cyan:
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

/*
Pseudo-Code
Managed to properly display items in a table but didn't get to the rest of the activity. 
My plan was to JOIN and GROUP BY the tables to by department and calculate the overhead costs of each department to display in a new table 
when the supervizor enters "View Product Sales by Department."

Also I would add a Create New Department function that would add a new Department to the department table while also adding the department as an option
within the products table. 

I did not include the logic to automaticalle add a new menu option as a customer when new departments were created although giving a departments
option wasn't part of the assignment, just something I wanted to include.

Finally, I was not able to finalize password validation but my goal was to give the Manager and Supervisor a four digit code that needed entered to access their applications.

*/