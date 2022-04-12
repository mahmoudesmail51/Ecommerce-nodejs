const {Product} = require('../models/product')
const {Cart} = require('../models/cart')
const {Order} = require('../models/order')
const asyncHandler =  require("express-async-handler")


const addOrder = asyncHandler(async (req,res)=> {

    const user = req.user
    const user_cart = await Cart.findOne({user : user._id})
    if(!user_cart) return res.status(404).send('Fill cart!')
    
    const order = new Order({
        user: req.user,
        order_items : {
            items: user_cart.items,
            totalQuantity: user_cart.totalQuantity,
            totalPrice: user_cart.totalPrice
        },
        address: req.body.address,
        payment: 'Test'
    })
    await order.save(async (error, savedOrder)=> {
        if(error){
            return res.status(400).send(error)
        }
        await Cart.findByIdAndDelete(user_cart._id)
        
        res.status(200).json(savedOrder)

    })
})

module.exports = {
    addOrder
}