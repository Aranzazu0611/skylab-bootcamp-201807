require('dotenv').config()

const express = require('express')
const bodyParser = require('body-parser')
const { logic, LogicError } = require('./logic')
const jwt = require('jsonwebtoken')
const validateJwt = require('./helpers/validate-jwt')

const router = express.Router()
const jsonBodyParser = bodyParser.json({ limit: '3mb' })

router.post('/register', jsonBodyParser, (req, res) => {
    const { body: { email, name, password, photoProfile } } = req
    logic.register(email, name, password, photoProfile)
        .then(() => res.status(201).json({ message: 'user registered' }))
        .catch(err => {
            const { message } = err

            res.status(err instanceof LogicError ? 400 : 500).json({ message })
        })

})

router.post('/authenticate', jsonBodyParser, (req, res) => {
    const { body: { email, password } } = req

    logic.authenticate(email, password)
        .then(id => {
            const { JWT_SECRET, JWT_EXP } = process.env

            const token = jwt.sign({ sub: id }, JWT_SECRET, { expiresIn: JWT_EXP })

            res.json({ message: 'user authenticated', token, user: id })
        })
        .catch(err => {

            const { message } = err

            res.status(err instanceof LogicError ? 401 : 500).json({ message })
        })
})
// update preguntar a mikel lo del email
router.patch('/user/:userId', [validateJwt, jsonBodyParser], (req, res) => {
    const { params: { userId }, body: { password, newPassword } } = req

    logic.updatePassword(userId, password, newPassword)
        .then(() => res.json({ message: 'Password update correctly' }))
        .catch(err => {
            const { message } = err
            res.status(err instanceof LogicError ? 400 : 500).json({ message })
        })
})

//retrive bookId

router.get('/user/:userId/book/:bookId', validateJwt, (req, res) => {
    const { params: { bookId, userId } } = req

    logic.retrieveBook(bookId, userId)
        .then(book => res.json({ message: 'Retrieve book correctly', book }))
        .catch(err => {
            const { message } = err
            res.status(err instanceof LogicError ? 400 : 500).json({ message })
        })
})

//unregister
router.delete('/unregister', jsonBodyParser, (req, res) => {
    const { body: { userId, password } } = req

    logic.unregister(userId, password)
        .then(() => res.json({ message: 'User deleted correctly' }))
        .catch(err => {
            const { message } = err
            res.status(err instanceof LogicError ? 400 : 500).json({ message })
        })
})

//retrieve User

router.get('/user/:userId', validateJwt, (req, res) => {
    const { params: { userId } } = req

    logic.retrieveUser(userId)
    .then(data => res.json(data))
        .catch(err => {
            const { message } = err
            res.status(err instanceof LogicError ? 400 : 500).json({ message })
        })

})

//add review
router.post('/user/:userId/reviews', [validateJwt, jsonBodyParser], (req, res) => {
    const { params: { userId }, body: { book, title, vote, comment } } = req
    debugger;
    logic.addReview(userId, book, title, vote, comment)
        .then(() => res.status(201).json({ message: 'Review added correctly' }))
        .catch(err => {
            const { message } = err
            res.status(err instanceof LogicError ? 400 : 500).json({ message })
        })
})


//list reviews by user

router.get('/user/:userId/reviews', validateJwt, (req, res) => {
    const { params: { userId } } = req

    logic.listReviews(userId)
        .then(data => res.json(data))
        .catch(err => {
            const { message } = err
            res.status(err instanceof LogicError ? 400 : 500).json({ message })
        })

})

// list reviews by book

// http://localhost:8080/api/user/5b98d346a0705b18c4b08a40/book/huy8PQAACAAJ/reviews
router.get('/user/:userId/book/:bookId/reviews', validateJwt, (req, res) => {
    const { params: { bookId } } = req

    debugger

    logic.listReviewsByBook(bookId)
        .then(data => res.json(data))
        .catch(err => {
            const { message } = err
            res.status(err instanceof LogicError ? 400 : 500).json({ message })
        })
})

//delete reviews

router.delete('/user/:userId/reviews/:reviewId', validateJwt, (req, res) => {
    const { params: { reviewId, userId } } = req

    logic.deleteReviews(reviewId, userId)
        .then(() => res.json({ message: 'Review deleted correctly' }))
        .catch(err => {
            const { message } = err
            res.status(err instanceof LogicError ? 400 : 500).json({ message })
        })
})



//add favorites

router.post('/user/:userId/favorites', [validateJwt, jsonBodyParser], (req, res) => {
    const { params: { userId }, body: { bookId } } = req

    logic.addFavorite(userId, bookId)
        .then(() => res.status(201).json({ message: 'Favourite added correctly' }))
        .catch(err => {
            const { message } = err
            res.status(err instanceof LogicError ? 400 : 500).json({ message })
        })

})

//list favorites

router.get('/user/:userId/favorites', validateJwt, (req, res) => {
    const { params: { userId } } = req

    logic.listFavorites(userId)
        .then(res.json.bind(res))
        .catch(err => {
            const { message } = err

            res.status(err instanceof LogicError ? 400 : 500).json({ message })
        })


})


//delete favorites

router.delete('/user/:userId/favorites/:bookId', validateJwt, (req, res) => {
    const { params: { userId, bookId } } = req

    logic.deleteFavorite(userId, bookId)
        .then(() => res.json({ message: 'Favorites deleted correctly' }))
        .catch(err => {
            const { message } = err
            res.status(err instanceof LogicError ? 400 : 500).json({ message })
        })
})


//search 

// /user/:userId/searchbook?query=Harry Potter&searchBy=Title&orderBy=relevance
router.get('/user/:userId/searchbook', validateJwt, (req, res) => {
    const { params: { userId }, query: { query, searchBy, orderBy } } = req

    logic.searchBook(userId, query, searchBy, orderBy)
        .then(books => res.json({ message: 'Search correctly', books }))
        .catch(err => {
            const { message } = err
            res.status(err instanceof LogicError ? 400 : 500).json({ message })
        })
})

//saveimage
router.post('/saveimage', jsonBodyParser, (req, res) => {
    const { body: { base64Image } } = req
    debugger;
    logic.saveImage(base64Image)
        .then(url => res.json({ message: 'Save image correctly', url }))
        .catch(err => {
            const { message } = err
            res.status(err instanceof LogicError ? 400 : 500).json({ message })
        })
})




module.exports = router