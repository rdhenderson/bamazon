function Product(obj){
  this.item_id = obj.item_id;
  this.product_name = obj.product_name;
  this.department_name = obj.department_name;
  this.price = obj.price;
  this.stock_quantity = obj.stock_quantity;
}

Product.prototype.display = function(){
  console.log('Id: ' + this.item_id + ' | name: ' + this.product_name + ' | dept: ' +
              this.department_name + ' | price: ' + this.price + ' | quantity: ' + this.stock_quantity);
};

exports.Product = Product;
