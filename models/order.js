const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    order_items : {
        items : [{
            productId : {
                type: mongoose.Schema.Types.ObjectId,
                ref : 'Product'
            },
            quantity: Number,
            price: Number,
            title: String,
            sku: String
        }],
        totalQuantity : {
            type : Number,
            required : true
        },
        totalPrice : {
            type: Number,
            required: true
        }
    },
    address : {
        type: String,
        required : true
    },
    payment:{
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
      },
    delivered: {
        type: Boolean,
        default : false
    }
})

const Order = mongoose.model('Order',orderSchema)

module.exports.Order = Order