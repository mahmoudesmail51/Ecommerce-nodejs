const {Product} = require('../models/product')
const {Cart} = require('../models/cart')
const asyncHandler =  require("express-async-handler")
const mongoose = require('mongoose');


/* 
All logic is handled except for sessions and empty carts if the user is not logged in

handled whenever front-end is implemented.

*/


// @desc    add item to cart 
// @route   GET /api/add-to-cart/:id
// @access  Public
const addItemToCart = asyncHandler(async (req,res)=>{
    const productId = req.params.id
    const user = req.user
   
    // try {
        //get the cart (logged in, session, empty cart)
        let user_cart;
        //user logged in
        if(user){
            user_cart = await Cart.findOne({user: user._id})
        }
     
        // if((user && !user_cart && req.session.cart)||(!user && req.session.cart)){
        //     cart = await new Cart(req.session.cart)
        // }   
        let cart;
        if(!user || !user_cart) {
            cart = new Cart({})
        } else {
            cart = user_cart
        }

        //add product to the cart
        const product = await Product.findById(productId)
        const itemIndex = cart.items.findIndex((p) => p.productId == productId)
        if(itemIndex > -1){
            //product exists, update quantity
            cart.items[itemIndex].quantity++;
            cart.items[itemIndex].price = cart.items[itemIndex].quantity * product.price
            cart.totalQuantity++
            cart.totalPrice += product.price
        }else{
            //product doesn't exists in cart, add to cart
            cart.items.push({
                productId: productId,
                quantity: 1,
                price: product.price,
                title: product.title,
                sku: product.sku
            })
            cart.totalQuantity++
            cart.totalPrice += product.price
        }

        //if the user is logged in, store the user's id and save cart to the db
        if (req.user) {
            cart.user = req.user._id;
            await cart.save();
        }
        res.status(200).json(cart)


    // }catch(error){
    //     res.status(400).send(error.message)

    // }

})

// @desc    add item to cart 
// @route   GET /api/remove-from-cart/:id
// @access  Public
const removeItemFromCart = asyncHandler( async (req,res)=>{
    const productId = req.params.id
    let cart;
    if(req.user){
        cart = await Cart.findOne({user: req.user._id})
    }
    const itemIndex = cart.items.findIndex((p) => p.productId == productId)
    if(itemIndex > -1){
        //reduce price from the cart
        cart.totalQuantity -= cart.items[itemIndex].quantity
        cart.totalPrice -= cart.items[itemIndex].price
        await cart.items.remove({_id: cart.items[itemIndex]._id })
    }

    if(req.user)
        await cart.save();
    
     //delete cart if qty is 0
    if (cart.totalQuantity <= 0) {
        await Cart.findByIdAndRemove(cart._id);
      }
    
    res.status(200).json(cart)
})
// @desc    get content ofcart 
// @route   GET /api/cart
// @access  Public
const getCart = asyncHandler(async (req,res)=>{
    let cart;
    //get user's active cart
    if(req.user){
        cart = await Cart.findOne({user: req.user.id})
    }

    res.status(200).json(cart)
        
})

// @desc    get content ofcart 
// @route   GET /api/reduce/:id
// @access  Public
const reduceItemFromCart = asyncHandler(async (req,res)=>{
        let cart;
        //get user's cart
        if(req.user){
            cart = await Cart.findOne({user: req.user.id})
        }
        if(!cart){
            res.status(404).send("NO AVAILABLE CART")
        }
        const productId = req.params.id
        const itemIndex = cart.items.findIndex((p) => p.productId == productId)
        if (itemIndex > -1){
            // reduce quantity and total price
            const product = await Product.findById(productId);
            cart.items[itemIndex].quantity--;
            cart.items[itemIndex].price -= product.price
            cart.totalQuantity--;
            cart.totalPrice -= product.price
            if(cart.items[itemIndex].quantity <= 0){
                await cart.items.remove({_id: cart.items[itemIndex]._id})
            }
            if(req.user){
                await cart.save()
            }
            if(cart.totalQuantity == 0){
                await Cart.findByIdAndRemove(cart._id)
            }
        }
        res.status(200).json(cart)
})
module.exports = {
    addItemToCart,
    removeItemFromCart,
    getCart,
    reduceItemFromCart
}