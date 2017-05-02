var mysql = require('mysql');
var inquirer = require('inquirer');
var Product = require('./product.js').Product;

function Bamazon() {
	this.products = [];
	this.connection = mysql.createConnection(
	    {
	      host     : 'localhost',
	      user     : 'root',
	      password : '',
	      database : 'bamazon',
	    }
	);
};


Bamazon.prototype.addProduct = function(obj){
	this.products.push(new Product(obj));
};

Bamazon.prototype.getProducts = function() {
	var queryString = 'SELECT * FROM products';
	var that = this;
	this.connection.query(queryString, function(err, rows, fields) {
	    if (err) return console.log(err);
	    for (var i in rows) {
        that.addProduct(rows[i]);
	    }
      return that.listen();
	});
};
Bamazon.prototype.showProducts = function() {
  for (var i = 0; i < this.products.length; i++) {
    console.log('Id: ' + this.products[i].item_id + ' | name: ' + this.products[i].product_name + ' | dept: ' +
                  this.products[i].department_name + ' | price: ' + this.products[i].price + ' | quantity: ' + this.products[i].stock_quantity);
  }
}

Bamazon.prototype.quit = function() {
  console.log('Thank you for shopping with Bamazon! Please come again.');
  this.connection.end();
  process.exit();
}

Bamazon.prototype.sellProduct = function(table, id, updatedQuantity) {
	var queryString = 'UPDATE products SET stock_quantity = ? WHERE item_id = ?';
	var that = this;
	this.connection.query(queryString, [updatedQuantity, id], function(err, rows, fields) {
	    if (err) return console.log(err);
      return that.listen();
	});
};

var storeFront = new Bamazon();
storeFront.getProducts();

Bamazon.prototype.listen = function(){
	//Choose question set based on command line interface flag
  this.showProducts();
	var that = this;
	var questions = [
		{
			type: 'input',
			name: 'item',
			message: 'Please select the product you wish to purchase (0 to quit)'
		},{
			type: 'input',
			name: 'quantity',
			message: 'How many would you like to purchase?',
      when: function(answers){
       return answers.item > 0;
       }
		}];

	inquirer.prompt(questions).then(function(answers){
    if (parseInt(answers.item) === 0) {
      return that.quit();
    }
    for (var i = 0; i < that.products.length; i++) {
      if (parseInt(that.products[i].item_id) === parseInt(answers.item)){
        if (that.products[i].stock_quantity < answers.quantity) {
          console.log('Insufficient quantity in stock.  Please try again later.');
          return that.listen();
        } else {
          that.products[i].stock_quantity -= answers.quantity;
          console.log('Total cost: $', parseFloat(answers.quantity * that.products[i].price).toFixed(2));
          return that.sellProduct('products', answers.item, that.products[i].stock_quantity);
        }
      }
    }
    console.log('Please select a valid product.');
	});
};
