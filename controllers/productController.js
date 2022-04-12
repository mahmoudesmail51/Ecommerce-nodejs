const {Product, validate} = require('../models/product')
const asyncHandler =  require("express-async-handler")
const mongoose = require('mongoose');

// @desc create a new product
// @route POST /api/products
// @access public
const createProduct = asyncHandler( async (req, res)=>{

    const {error} = validate(req.body);
    
    if(error) return res.status(400).send(error.details[0].message);
    const {sku} = req.body
    const skuExists = await Product.findOne({sku})
    if(skuExists) return res.status(400).send('SKU already exists!')

    const product = new Product(req.body)

    if(product){
        await product.save()
        res.status(201).json(product);
    }else {
        res.status(400).send("Invalid product data");
      }

});

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {

    
    const pageSize = 10
    const page = Number(req.query.pageNumber) || 1
  
    const count = await Product.countDocuments()
    const products = await Product.find()
      .limit(pageSize)
      .skip(pageSize * (page - 1))
  
    res.json({ products, page, pages: Math.ceil(count / pageSize) })
  })


// @desc    get product by id
// @route   GET /api/products/:id
// @access  Public
const getProduct = asyncHandler(async (req,res)=>{

    const product = await Product.findById(req.params.id);

    if (product) {
        res.json(product)
      } else {
        res.status(404).send("Product not found")
        
      }

});

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = asyncHandler(async (req,res) =>{
  const updated_data = req.body
  const _id = req.params.id;
  const isValidId = mongoose.Types.ObjectId.isValid(_id)

  if (!isValidId) return res.status(400).send("id is not valid")

  let updated_product = await Product.findByIdAndUpdate(_id,updated_data,{new: true})

  if(updated_product){
    res.json(updated_product)
  }else{
    res.status(404).send("Product not found")
  }
});


// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
  const _id = req.params.id;
  const isValidId = mongoose.Types.ObjectId.isValid(_id)

  if (!isValidId) return res.status(400).send("id is not valid")
  const product = await Product.findById(_id)

  if (product) {
    await product.remove()
    res.json({ message: 'Product removed' })
  } else {
    res.status(404)
    throw new Error('Product not found')
  }
})

module.exports = {
    createProduct,
    getProducts,
    getProduct,
    updateProduct,
    deleteProduct
};