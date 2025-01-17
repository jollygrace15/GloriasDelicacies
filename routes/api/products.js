const express = require('express')
const router = express.Router();

//double check
const { Product } = require('../../models');
const { createProductForm } = require('../../forms');

const productDataLayer = require('../../dal/products')

//OK
router.get('/', async function (req, res) {
    console.log("get products")
    res.send(await productDataLayer.getAllProducts())
    //const allProducts = await productDataLayer.getAllProducts();
    //res.json(allProducts)
})

//OK
router.post('/', async (req, res) => {
    const allCategories = await productDataLayer.getAllCategories();
    const allTags = await productDataLayer.getAllTags();
    const productForm = createProductForm(allCategories, allTags);
    console.log("post products")
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
           console.log("errors")
           for (let key in form.fields) {
               if (form.fields[key].error) {
                   errors[key] = form.fields[key].error;
               }
           }
           res.send(JSON.stringify(errors));
        }
    })
})

//OK
router.get('/:product_id/update', async function(req, res){
    //retrieve the product
    const productId = req.params.product_id;
    const product = await Product.where({
        'id': productId
    }).fetch({
        'require': true
    })
    // fetch all the categories
    // 1. get all the categories
    const choices = await productDataLayer.getAllCategories();

   // 2. Get all the tags -- unique syntax
   const allTags = await productDataLayer.getAllTags();

    //const productForm = createProductForm(choices, allTags);
    //res.send(product.toJSON());
    // fill in the existing values
    //productForm.fields.name.value = product.get('name');
    //productForm.fields.cost.value = product.get('cost');
    //productForm.fields.description.value = product.get('description');
    //productForm.fields.category_id.value = product.get('category_id');
    //productForm.fields.image_url.value = product.get('image_url');
    // get only the ids from the tags that belongs to the product
   //const selectedTags = await product.related('tags').pluck('id');
   // set the existing tags
   //productForm.fields.tags.value = selectedTags;

    res.send(await productDataLayer.getProductById(productId))
})




// OK
router.post('/:product_id/update', async (req, res) => {
    //retrieve the product
    const productId = req.params.product_id;
    const product = await Product.where({
        'id': productId
    }).fetch({
        'require': true
    })
    const allCategories = await productDataLayer.getAllCategories();
    const allTags = await productDataLayer.getAllTags();
    const productForm = createProductForm(allCategories, allTags);
    console.log("put products")
    productForm.handle(req, {
        'success': async (form) => {                    
            let { tags, ...productData } = form.data;
            //const product = new Product(productData);
            product.set(productData);
            await product.save();
    
            // save the many to many relationship
            if (tags) {
                await product.tags().attach(tags.split(","));
            }
            res.send(product);
        },
        'error': async (form) => {
           let errors = {};
           console.log("errors")
           for (let key in form.fields) {
               if (form.fields[key].error) {
                   errors[key] = form.fields[key].error;
               }
           }
           res.send(JSON.stringify(errors));
        }
    })

})



router.get('/:product_id/delete', async function(req,res){
    const productId = req.params.product_id;
    //const product = await getProductById(productId)
    // fetch the product that we want to delete
    const product = await Product.where({
    'id': req.params.product_id
    }).fetch({
    require: true
    });

    res.send(await productDataLayer.getProductById(productId))
    //res.render('products/delete',{
    //    'product': product.toJSON()
    //})
})

router.post('/:product_id/delete', async function(req,res){
    const productId = req.params.product_id;
    console.log("deleting product number: " + productId)
    //const product = await getProductById(req.params.product_id)
    const product = await Product.where({
        'id': req.params.product_id
        }).fetch({
        require: true
        });
    await product.destroy();
    res.send('deleted!');
})

module.exports = router;