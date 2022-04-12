
const Joi = require('joi');
const mongoose = require('mongoose');


const productSchema = new mongoose.Schema({
    sku : {
        type : String,
        required: true,
        unique: true,
        
    },
    title: {
        type: String,
        required: true,
        
        maxlength: 300
    },
    image: {
        type: String,
        required: true,
    },
    description : {
        type: String,
        required: true
    },
    quantity :{
        type: Number,
        required: true,
    },
    category : {
        type: String,
        required: true
    },
    price:{
        type: Number,
        required: true,
    },
    
},{strict: false})

const Product = mongoose.model('Product', productSchema)

function validateProduct(product){
    const schema = Joi.object({
        sku: Joi.string().required(),
        title: Joi.string().max(300).required(),
        image: Joi.string().required(),
        description: Joi.string().min(5).max(255).required(),
        quantity: Joi.number().required(),
        category: Joi.string().required(),
        price: Joi.number().required()

    });

    return schema.validate({
        sku: product.sku,
        title: product.title,
        image: product.image,
        description: product.description,
        quantity: product.quantity,
        category: product.category,
        price: product.price
    })

};

exports.Product = Product;
exports.validate = validateProduct;