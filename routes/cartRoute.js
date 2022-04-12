const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

const {addItemToCart,removeItemFromCart,getCart,reduceItemFromCart} = require('../controllers/cartController')

router.route('/add-to-cart/:id').post(auth,addItemToCart)
router.route('/remove-from-cart/:id').post(auth,removeItemFromCart)
router.route('/cart').get(auth,getCart)
router.route('/reduce/:id').post(auth,reduceItemFromCart)
module.exports = router;