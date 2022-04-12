const Joi = require('joi');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        trim: true,
        required: true,
        minlength: 5,
        maxlength: 55
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255
    },

},{strict: false})
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password)
  }

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
      next()
    }
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
  })

const User = mongoose.model('User', userSchema)

function validateUser(user){
    const schema = Joi.object({
        name: Joi.string().min(5).max(55).required(),
        email: Joi.string().required().email(),
        password: Joi.string().min(5).max(255).required()
    });

    return schema.validate({
        name: user.name,
        email: user.email,
        password: user.password
    })

}
exports.User = User;
exports.validate = validateUser;