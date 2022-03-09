const express = require('express'); 
const { checkIfAuthenticated } = require('../middlewares');
const router = express.Router();

const cartDataLayer = require('../dal/cart_items');

router.get('/:product_id/add', checkIfAuthenticated, async function(req, res){
    let userId = req.session.user.id;
    let productId = req.params.product_id;
    let quantity = 1;

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
    req.flash('success_messages', 'Product has been added to cart');
    res.redirect('back');
})

module.exports = router;