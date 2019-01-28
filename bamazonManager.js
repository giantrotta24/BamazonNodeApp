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

function promptOptions() {
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
                console.log("nothing yet");
                connection.end();
                break;

            case "Add New Product".magenta:
                console.log("nothing yet");
                connection.end();
                break;

            case "Exit".red:
                endApp();
                break;
        }
    });
}

function queryLow() {
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
        //trigger purchase prompt
        promptOptions();
    });
}


function queryAll() {
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
        //trigger purchase prompt
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

