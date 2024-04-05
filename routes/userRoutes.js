const { Router } = require('express')
const router = Router()
const User = require('../model/user')
const jwt = require('jsonwebtoken')



// handle errors
const handleErrors = (err) => {
    console.log(err.message, err.code)
    let errors = { firstName: '', lastName: '', matricNumber: '', email: '', password: '' }

    // incorrect firstName
    // if(err.message === ''){
    //     errors.firstName = 'Fill in this field'
    // }

    // incorrect lastName
    // if(err.message === ''){
    //     errors.lastName = 'Fill in this field'
    // }

    // incorrect email
    if(err.message === 'incorrect email'){
        errors.email = 'That email is not registered'
    }

    // incorrect password
    if(err.message === 'incorrect password'){
        errors.password = 'That password is incorrect'
    }

    // duplicate error code
    if(err.code === 11000){
        errors.email = 'That email is already registered'
    }

    // validation errors
    if(err.message.includes('user validation failed')){
        Object.values(err.errors).forEach(({properties}) => {
            errors[properties.path] = properties.message
        })
    }

    return errors
}

const maxAge = 3 * 24 * 60 * 60
const createToken = (id) => {
    return jwt.sign({id}, 'Oluwayemi Dev', {
        expiresIn: maxAge
    })
}

router.get('/login', (req, res) => {
    res.render('login', { title: 'Login' })
})
router.get('/signup', (req, res) => {
    res.render('signup', { title: 'Create Account' })
})
router.post('/signup', async (req, res) => {
    const { firstName, lastName, matricNumber, email, password } = req.body

    try{
        const user = await User.create({ firstName, lastName, matricNumber, email, password })
        const token = createToken(user._id)
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 })
        res.status(201).json({ user: user._id })
    }
    catch(err){
        const errors = handleErrors(err)
        res.status(400).json({ errors })
    }
})
router.post('/login', async (req, res) => {
    const { email, password } = req.body

    try{
        const user = await User.login(email, password)
        const token = createToken(user._id)
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 })
        res.status(200).json({ user: user._id })
    }
    catch(err){
        const errors = handleErrors(err)
        res.status(400).json({ errors })
    }
})
router.get('/logout', (req, res) => {
    res.cookie('jwt', '', { maxAge: 1 })
    res.redirect('/')
})

module.exports = router