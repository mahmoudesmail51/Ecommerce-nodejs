const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {createUser,getUsers} = require('../controllers/userController')


router.route('/').post(createUser)
router.route('/').get(auth,getUsers)


module.exports = router;    