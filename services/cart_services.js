const cartDataLayer = require('../dal/cart_items.js');

class CartServices {
    constructor(user_id) {
        this.user_id = user_id;
    }

    async getAllCartItems() {
        const allCartItems = await cartDataLayer.getCart(this.user_id);
        return allCartItems;
    }

    //async addToCart(productId, quantity) {
    //    let cartItem = await cartDataLayer.getCartItemByUserAndProduct(this.user_id, productId);
    //    if (cartItem) {
    //         //cartItem.set('quantity', cartItem.get('quantity') + quantity)
    //         //await cartItem.save();

    //        cartDataLayer.updateCartItem(this.user_id, productId, cartItem.get('quantity') + quantity)
    //    } else {
             // todo: check whether if there is enough stock       
    //         await cartDataLayer.createCartItem(this.user_id, productId, quantity);
    //    }
    //    return cartItem;
    //}

    async addToCart(productId, quantity) {
        // check if the user has added the product to the shopping cart before
        let cartItem = await cartDataLayer
                            .getCartItemByUserAndProduct(this.user_id, productId);
       if (cartItem) {
            return await cartDataLayer
            .updateQuantity(this.user_id, productId, cartItem.get('quantity') + 1);
        } else {
            let newCartItem = cartDataLayer.
                              createCartItem(this.user_id, productId, quantity);
            return newCartItem;
        }
    }

    async remove(productId) {
        return await cartDataLayer
               .removeFromCart(this.user_id, productId);
    }


    async updateQuantity(productId, newQuantity) {
        let status = await cartDataLayer.updateCartItem(this.user_id, productId, newQuantity);
        return status;
     }
}

module.exports = CartServices;