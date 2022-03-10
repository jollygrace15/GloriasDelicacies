//If we require a directory or folder instead of
//nodejs will default to look for index.js
const bookshelf = require('../bookshelf')


const Product = bookshelf.model('Product', {
    tableName:'products', // which table is this model referring to
    category() {
        return this.belongsTo('Category')
    }, //The products table belongs to one category
      //A table of juices belongs to a juice category
    tags() {
        return this.belongsToMany('Tag');
    }
});

const Category = bookshelf.model('Category',{ // 'Category' and the tableName: 'categories' must be related, only s is its difference.
    tableName: 'categories',
    products() {
        return this.hasMany('Product');
    },
    
})


// first arg is the name of the model, so the model's name is the Tag
const Tag = bookshelf.model('Tag', {
    tableName:'tags',
    products() {
        return this.belongsToMany('Product');
    },
})


// first arg is the name of the model, and it must be singular form of the
// table name, with the first alphabet in uppercase.
const User = bookshelf.model("User", {
    'tableName':'users',
    cartItems() {
        return this.belongsTo('')
    }
})

const CartItem =  bookshelf.model("CartItem", {
    'tableName': 'cart_items',
    product(){
        return this.belongsTo('Product');
    }
})
module.exports = { Product, Category, Tag, User, CartItem };