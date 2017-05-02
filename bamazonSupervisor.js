var mysql = require('mysql');
var inquirer = require('inquirer');
var Product = require('./product.js').Product;
require('console.table');

function Supervisor (){
  this.products = [];
  this.departments = [];
  this.connection = mysql.createConnection(
      {
        host     : 'localhost',
        user     : 'root',
        password : '',
        database : 'bamazon',
      }
  );
  this.initialize();
};

Supervisor.prototype.initialize = function(){
  var queryString = 'SELECT * FROM products';
  var that = this;
  this.connection.query(queryString,function(err, rows, fields) {
      if (err) return console.log(err);
      for (var i =0; i < rows.length; i++) {
          that.products.push(new Product(rows[i]));
          if(that.departments.indexOf(rows[i].department_name === -1)){
            that.departments.push(rows[i].department_name);
          }
      }
      return that.listen();
  });
}

Supervisor.prototype.listen = function(){
	//Choose question set based on command line interface flag
	var that = this;
	var questions = [
		{
			type: 'list',
			name: 'action',
			message: 'Please select an action below:',
      choices: ['1) View Products Sales by Department', '2) Create New Department', '3) Quit']
		},
    {
      type: 'input',
      name: 'new_department',
      message: 'Please enter the name of the department you wish to add',
      when: function(answers){
          return parseInt(answers.action.split(')')[0]) === 2;
        }
      },
      {
        type: 'input',
        name: 'overhead',
        message: 'Enter the overhead costs for the new department:',
        when: function(answers){
          return parseInt(answers.action.split(')')[0]) === 2;
        }
      }];

	inquirer.prompt(questions).then(function(answers){
    switch(parseInt(answers.action.split(')')[0])) {
      case 1:
        return that.showProductSales();
        break;
      case 2:
        return that.createDepartment(answers.new_department, answers.overhead);
        break;
      case 3:
        return that.exit();
        break;

    }
	});
};


Supervisor.prototype.showProductSales = function(){
    var queryString = 'SELECT * FROM departments';
  	var that = this;
  	this.connection.query(queryString, function(err, rows, fields) {
  	    if (err) return console.log(err);
        for(var i = 0; i < rows.length; i++){
          rows[i].total_profit = rows[i].total_sales - rows[i].over_head_costs;
        }
          console.table(rows);

        return that.listen();
  	});
};

Supervisor.prototype.createDepartment = function(department_name, overhead) {
  if(this.departments.indexOf(department_name) > -1){
    return console.log('Department already exists. Please try again');
  }
  var queryString = 'INSERT INTO departments (department_name, over_head_costs, total_sales) VALUES (?, ?, 0)';
	var that = this;
	this.connection.query(queryString, [department_name, overhead], function(err, rows, fields) {
	    if (err) return console.log(err);
      that.departments.push(department_name);
      return that.listen();
	});
};

Supervisor.prototype.exit = function(){
  console.log('Goodbye.');
  process.exit();
}

var supervisorConsole = new Supervisor();
