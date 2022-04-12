const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const {addOrder} = require('../controllers/orderController')

router.route('/checkout').post(auth, addOrder)

module.exports = router;