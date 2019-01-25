CREATE DATABASE bamazon_DB;

USE bamazon_DB;

CREATE TABLE products (
    item_id INTEGER(50) AUTO_INCREMENT NOT NULL,

    product_name VARCHAR(50) NOT NULL,

    department_name VARCHAR(50) NOT NULL,

    price  DECIMAL(10,4) NOT NULL,

    stock_quantity INTEGER(100) NOT NULL
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Sleepy Tea", "Grocery", 5.33, 100),
("Coffee Grounds", "Grocery", 11.33, 100),
("Planters' Nuts", "Grocery", 7.62, 100),
("Paper Towels", "Grocery", 18.44, 100),
("Mac & Cheese", "Grocery", 2.99, 100),
("Body Wash", "Personal Care", 13.99, 100),
("Shampoo", "Personal Care", 8.13, 100),
("Conditioner", "Personal Care", 8.13, 100),
("Hair Gel", "Personal Care", 5.98, 100),
("Toothpaste", "Personal Care", 7.59, 100),
("Deodorant", "Personal Care", 3.98, 100);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Indiana Jones Movie Set BlueRay", "Entertainment", 39.49, 100),
("Saving Private Ryan BlueRay", "Entertainment", 19.96, 100),
("Jumanji BlueRay", "Entertainment", 19.99, 100),
("Dark Knight Trilogy BlueRay", "Entertainment", 54.93, 100),
("Queen Greatest Hits CD", "Entertainment", 21.20, 100),
("Backstreet Boys Greatest Hits CD", "Entertainment", 19.97, 100),
("The Dark Side of the Moon Vinyl", "Entertainment", 25.26, 100),
("Madden 19 XboxOne", "Entertainment", 31.98, 100),
("Fifa 19 PS4", "Entertainment", 45.27, 100),
("Red Dead Redemption II", "Entertainment", 59.99, 100);


