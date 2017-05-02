var mysql = require('mysql');
var inquirer = require('inquirer');
var Product = require('./product.js').Product;

function Manager (){
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

Manager.prototype.listen = function(){
	//Choose question set based on command line interface flag
	var that = this;
	var questions = [
		{
			type: 'list',
			name: 'action',
			message: 'Please select an action below:',
      choices: ['1) View Products for Sale', '2) View Low Inventory', '3) Add to Inventory', '4) Add New Product']
		},
    {
      type: 'input',
      name: 'item_id',
      message: 'Please enter the id of the item you wish to add',
      when: function(answers){
        return parseInt(answers.action.split(')')[0]) === 3;
      }
    },
    {
      type: 'input',
      name: 'add_quantity',
      message: 'Please enter the number of items you wish to add',
      when: function(answers){
          return parseInt(answers.action.split(')')[0]) === 3;
        }
      },
      {
        type: 'input',
        name: 'product_name',
        message: 'Product name:',
        when: function(answers){
          return parseInt(answers.action.split(')')[0]) === 4;
          }
        },
        {
          type: 'input',
          name: 'department_name',
          message: 'Department name:',
          when: function(answers){
            return parseInt(answers.action.split(')')[0]) === 4;
            }
          },
          {
            type: 'input',
            name: 'price',
            message: 'Product price:',
            when: function(answers){
              return parseInt(answers.action.split(')')[0]) === 4;
              }
            },
            {
              type: 'input',
              name: 'stock_quantity',
              message: 'Stock quantity:',
              when: function(answers){
                return parseInt(answers.action.split(')')[0]) === 4;
              }
            }];

	inquirer.prompt(questions).then(function(answers){
    console.log('Selection', answers.action.split(')')[0]);
    switch(parseInt(answers.action.split(')')[0])) {
      case 1:
        return that.showProducts();
        break;
      case 2:
        return that.showLowInventory();
        break;
      case 3:
        return that.addInventory(answers.item_id, answers.add_quantity);
        break;
      case 4:
        return that.addNewProduct([answers.product_name, answers.department_name, answers.price, answers.stock_quantity]);
        break;
    }
	});
};

Manager.prototype.showProducts = function(){
  console.log('Show Products');
    var queryString = 'SELECT * FROM products';
  	var that = this;
  	this.connection.query(queryString,function(err, rows, fields) {
  	    if (err) return console.log(err);
  	    for (var i in rows) {
            console.log('Id: ' + rows[i].item_id + ' | name: ' + rows[i].product_name + ' | dept: ' +
                          rows[i].department_name + ' | price: ' + rows[i].price + ' | quantity: ' + rows[i].stock_quantity);
        }
        return that.listen();
  	});
};

Manager.prototype.showLowInventory = function() {
  var queryString = 'SELECT * FROM products WHERE stock_quantity < 10';
  var that = this;
  this.connection.query(queryString,function(err, rows, fields) {
      if (err) return console.log(err);
      for (var i in rows) {
          console.log('Id: ' + rows[i].item_id + ' | name: ' + rows[i].product_name + ' | dept: ' +
                        rows[i].department_name + ' | price: ' + rows[i].price + ' | quantity: ' + rows[i].stock_quantity);
      }
      return that.listen();
  });
};

Manager.prototype.addInventory = function(item_id, quantity) {
  var queryString = 'UPDATE products SET stock_quantity = stock_quantity + ? WHERE item_id = ?';
	var that = this;
	this.connection.query(queryString, [quantity, item_id], function(err, rows, fields) {
	    if (err) return console.log(err);
      return that.listen();
	});
};
Manager.prototype.addNewProduct = function(valuesArray) {
  var queryString = 'INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES (?, ?, ?, ?)';
	var that = this;
	this.connection.query(queryString, valuesArray, function(err, rows, fields) {
	    if (err) return console.log(err);
      return that.listen();
	});
};

var managerConsole = new Manager();
managerConsole.listen();
