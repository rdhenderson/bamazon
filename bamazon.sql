CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products (
	item_id INTEGER(11) AUTO_INCREMENT NOT NULL, 
	product_name VARCHAR(255) NOT NULL,
	department_name VARCHAR(255) NOT NULL, 
	price INTEGER(11) NOT NULL, 	
	stock_quantity INTEGER(11) NOT NULL, 
    PRIMARY KEY (item_id)
);

ALTER TABLE products 
MODIFY COLUMN price FLOAT(64);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES
	("Gorble Snorts", "kitchen", 175, 100),
    ("deodorant", "bath", 5, 50), 
    ("unicorns", "toys", 300, 3);
    
CREATE TABLE departments (
	department_id INTEGER(15) AUTO_INCREMENT NOT NULL,
    department_name VARCHAR(255), 
    over_head_costs INTEGER(15), 
    total_sales INTEGER(15),
    PRIMARY KEY(department_id)
);