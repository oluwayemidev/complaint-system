const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const { isEmail } = require('validator')

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, "This field can't be empty"]
    },
    lastName: {
        type: String,
        required: [true, "This field can't be empty"]
    },
    matricNumber: {
        type: String,
        required: [true, "This field can't be empty"]
    },
    email: {
        type: String,
        required: [true, "This field can't be empty"],
        unique: true,
        lowercase: true,
        validate: [isEmail, "Please enter a valid email"]
    },
    password: {
        type: String,
        required: [true, "Please enter a password"],
        minLength: [8, "Minimum password length is 8 characters"]
    }
})

// encrypt password before saved to database
userSchema.pre('save', async function(next){
    const salt = await bcrypt.genSalt()
    this.password = await bcrypt.hash(this.password, salt)
    next()
})

// static method to login user
userSchema.statics.login = async function(email, password){
    const user = await this.findOne({ email })
    if(user){
        const auth = await bcrypt.compare(password, user.password)
        if(auth){
            return user;
        }
        throw Error('incorrect password');
    }
    throw Error('incorrect email')
}

const User = mongoose.model('user', userSchema)
module.exports = User;