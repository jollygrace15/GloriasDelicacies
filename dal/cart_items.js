const { CartItem } = require('../models');

// first arg: the id of the user that we want  get the shopping cart for
const getCart = async function(userId) {
    let allCartItems =  await CartItem.collection()
    .where({
        'user_id': userId
    }).fetch({
        'require': false, // user can have no item in their shopping cart
        'withRelated': ['products', 'products.category']
    })
}



const getCartItemByUserAndProduct = async function(userId, productId) {
    const cartItem  = await CartItem.where({
        'user_id': userId,
        'product_id': productId
    }).fetch({
        'require': false,
        //'withRelated': ['product', 'product.category']
    })
    return cartItem;
}

const createCartItem = async function(userId, productId, quantity){
    const cartItem = new CartItem({
        'user_id': userId,
        'product_id': productId,
        'quantity': quantity
    })
    await cartItem.save();
    return cartItem;
}


module.exports = { getCart, getCartItemByUserAndProduct, createCartItem} ;