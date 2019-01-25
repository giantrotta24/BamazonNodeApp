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
connection.connect(function(err) {
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
        choices: ["Shop".yellow, "View Cart".blue, "Check Out".magenta, "Exit".red]
    }).then(function(answer) {
        //switch function
        switch (answer.menu) {
            case "Shop".yellow:
            shop();
            break;

            case "View Cart".blue:
            viewCart();
            break;

            case "Check Out".magenta:
            checkOut();
            break;

            case "Exit".red:
            endApp();
            break;
        }
    });
}

//shopping
function shop() {

    inquirer.prompt({
        name: "department",
        type: "list",
        message: "Select a department",
        choices: ["Groceries".yellow, "Personal Care".blue, "Entertainment".magenta, "View All".green, "Back to Menu".red]
    }).then(function(response) {
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



function queryAll() {
    connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;
        console.log(res);
        
        for (i = 0; i < res.length; i++) {
            console.log(res[i]);
        }
    });
    connection.end();
}

function groceries() {
    console.log("nothing yet");
    connection.end();
}

function personalCare() {
    console.log("nothing yet");
    connection.end();
}

function entertainment() {
    console.log("nothing yet");
    connection.end();
}





//View Cart
function viewCart() {
    console.log("nothing yet");
    connection.end();
}

//Check out function
function checkOut() {
    console.log("nothing yet");
    connection.end();
}

//exit option
function endApp() {
    console.log('\n');
    console.log('\n');
    console.log('--------------------'.red);
    console.log('\n');
    console.log("Thank you for shopping with Bamazon™".red);
    console.log('\n');
    console.log('--------------------'.red);
    console.log('\n');
    console.log('\n');
    connection.end();
}