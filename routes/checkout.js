const express = require('express');
const router = express.Router();

const CartServices = require('../services/cart_services')
const Stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

router.get('/', async (req, res) => {
    const cart = new CartServices(req.session.user.id);

    // get all the items from the cart
    let items = await cart.getAllCartItems();
   
    // step 1 - create line items
    let lineItems = [];
    let meta = [];
    for (let item of items) {
        const lineItem = {
            'name': item.related('product').get('name'),
            'amount': item.related('product').get('cost'),
            'quantity': item.get('quantity'),
            'currency': 'USD'
        }
        if (item.related('product').get('image_url')) {
            lineItem['images'] = [item.related('product').get('image_url')]
        }
        lineItems.push(lineItem);
        // save the quantity data along with the product id
        meta.push({
            'product_id' : item.get('product_id'),
            'quantity': item.get('quantity')
        })
    }

    // step 2 - create stripe payment
    let metaData = JSON.stringify(meta);
    const payment = {
        payment_method_types: ['card'],
        line_items: lineItems,
        success_url: process.env.STRIPE_SUCCESS_URL + '?sessionId={CHECKOUT_SESSION_ID}',
        cancel_url: process.env.STRIPE_ERROR_URL,
        metadata: {
            'orders': metaData
        }
    }

    // step 3: register the session
    let stripeSession = await Stripe.checkout.sessions.create(payment)
    res.render('checkout/checkout', {
        'sessionId': stripeSession.id, // 4. Get the ID of the session
        'publishableKey': process.env.STRIPE_PUBLISHABLE_KEY
    })
})

module.exports = router;