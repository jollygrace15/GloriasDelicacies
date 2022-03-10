const express = require('express'); 
const { checkIfAuthenticated } = require('../middlewares');
const router = express.Router();

//const cartDataLayer = require('../dal/cart_items.js');
const CartServices = require('../services/cart_services');

router.get('/', checkIfAuthenticated, async function(req,res){
    let userId = req.session.user.id;
    const cartServices = new CartServices(userId);
    const allCartItems = await cartServices.getAllCartItems();
    console.log("cart.js")
    res.send(allCartItems)
    //res.render('cart/index',{
    //    'cartItems': allCartItems.toJSON()
    //});
})

router.get('/:product_id/add', checkIfAuthenticated, async function(req, res){
    let userId = req.session.user.id;
    let productId = req.params.product_id;
    let quantity = 1;

    let cartServices = new CartServices(userId);
    await cartServices.addToCart(productId, quantity);
    //This is the business logic
            //let cartItem = await cartDataLayer.getCartItemByUserAndProduct(userId, productId);
            //if (cartItem) {
                //console.log(cartItem.get('quantity'));
                //if found, means the user already has this product in the shopping cart
                //cartItem.set('quantity', cartItem.get('quantity') + 1)
                //await cartItem.save();
           // }else{
                //todo: check whether if there is enough stock
                //await cartDataLayer.createCartItem(userId,productId, quantity);
           // }
    req.flash('success_messages', 'Product has been added to cart');
    res.redirect('back');
})


router.post('/:product_id/update', checkIfAuthenticated, async function(req,res){
    let newQuantity = req.body.newQuantity;
    const cartServices = new CartServices(req.session.user.id);
    await cartServices.updateQuantity(req.params.product_id, newQuantity);
    req.flash('success_messages', "Quantity has been updated");
    res.redirect('/cart/')
})

module.exports = router;