const {User, validate} = require('../models/user')
const asyncHandler =  require("express-async-handler")
const {generateToken} = require("../utils/generateToken")


// @desc create a new user
// @route POST /api/users
// @access public
const createUser = asyncHandler( async (req, res)=>{

        const {error} = validate(req.body)
        if(error) return res.status(400).send(error.details[0].message);
        const { name,password,email} = req.body

        const userExists = await User.findOne({email});

        if(userExists){
            res.status(400).send("Email already existed")
        }

        const user = new User(req.body)

        const payload = {
          id: user.id
        };

        const token = generateToken(user._id);
        if (user) {
            await user.save()
            res.status(201).json({
              _id: user._id,
              name: user.name,
              email: user.email,
              isAdmin: user.isAdmin,
              secondName: user.secondname ? user.secondname : "",
              token:  `Bearer ${token}`, 
            })
          }else {
            res.status(400).send("Invalid user data");
          }
});


// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
  
  const users = await User.find({})
  res.json(users)
})

module.exports = {
    createUser,
    getUsers,
}
