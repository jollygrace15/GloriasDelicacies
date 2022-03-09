const express = require('express'); 
const { checkIfAuthenticated } = require('../middlewares');
const router = express.Router();

const cartDataLayer = require('../dal/cart_items');

router.get('/:product_id/add', checkIfAuthenticated, async function(req, res){
    let userId = req.session.user.id;
    let productId = req.params.product_id;
    let quantity = 1;

    let cartServices = new CartServices(userId);
    await cartServices.addToCart(productId, quantity); 

    req.flash('success_messages', 'Product has been added to cart');
    res.redirect('back');
})

module.exports = router;