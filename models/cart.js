const Joi = require('joi');
const mongoose = require('mongoose');


const cartSchema = new mongoose.Schema({
    items: [
        {
            productId : {
                type: mongoose.Schema.Types.ObjectId,
                ref : 'Product'
            },
            quantity: Number,
            price: Number,
            title: String,
            sku: String
        }
    ],
    totalQuantity: {
      type: Number,
      default: 0,
      required: true,
    },
    totalPrice: {
      type: Number,
      default: 0,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
})
const Cart = mongoose.model('Cart',cartSchema)

exports.Cart= Cart