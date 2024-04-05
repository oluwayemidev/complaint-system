const express = require('express')
const app = express()
const port = process.env.PORT || 3000
const mongoose = require('mongoose')
const userRoutes = require('./routes/userRoutes')
const { requireAuth, checkUser } = require('./middleware/authMiddleware')
const cookieParser = require('cookie-parser')

// Middleware
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cookieParser())

// View Engine
app.set('view engine', 'ejs')

// Database Connection
const dbURL = "mongodb+srv://admin:test123@node-tuts.fytvyoz.mongodb.net/school-portal"
mongoose.connect(dbURL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((result) => app.listen(port))
    .catch((err) => console.log(err))

// Routes
app.get('*', checkUser)
app.get('/', (req, res) => {
    res.render('home', { title: '' })
})
app.get('/admin', (req, res) => {
    res.render('admin', { title: 'Admin' })
})
app.use(userRoutes)
app.get('/chat', requireAuth, (req, res) => {
    res.render('chat', { title: 'chat' })
})