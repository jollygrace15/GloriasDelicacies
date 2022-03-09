const cartDataLayer = require('../dal/cart_items');


class CartServices {
    constructor(user_id) {
        this.user_id = user_id;
    }

    async addToCart(userId, productId, quantity) {
        // check: if the cart item with the same product id and user id
    // is already in the database (check if the product is already in the shopping cart)

    let cartItem = await cartDataLayer.getCartItemByUserAndProduct(userId, productId);
    //console.log("cartItem= ", cartItem);
    if (cartItem) {
        //console.log(cartItem.get('quantity'));
        //if found, means the user already has this product in the shopping cart
        cartItem.set('quantity', cartItem.get('quantity') + 1)
        await cartItem.save();
    }else{
        //todo: check whether if there is enough stock
        await cartDataLayer.createCartItem(userId,productId, quantity);
    }
    return cartItem
    }
}

module.exports = CartServices