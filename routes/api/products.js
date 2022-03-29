const express = require('express')
const router = express.Router();

//double check
const { Product } = require('../../models');
const { createProductForm } = require('../../forms');

const productDataLayer = require('../../dal/products')

router.get('/', async function (req, res) {
    console.log("get products")
    res.send(await productDataLayer.getAllProducts())
    //const allProducts = await productDataLayer.getAllProducts();
    //res.json(allProducts)
})

// POST/api/products 
router.post('/', async (req, res) => {
    const allCategories = await productDataLayer.getAllCategories();
    const allTags = await productDataLayer.getAllTags();
    const productForm = createProductForm(allCategories, allTags);
    console.log("post products")
    console.log(allTags)
    productForm.handle(req, {
        'success': async (form) => {                    
            let { tags, ...productData } = form.data;
            const product = new Product(productData);
            await product.save();
    
            // save the many to many relationship
            if (tags) {
                await product.tags().attach(tags.split(","));
            }
            res.send(product);
        },
        'error': async (form) => {
           let errors = {};
           for (let key in form.fields) {
               if (form.fields[key].error) {
                   errors[key] = form.fields[key].error;
               }
           }
           res.send(JSON.stringify(errors));
        }
    })

})


module.exports = router;