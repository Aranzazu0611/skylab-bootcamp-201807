require('dotenv').config()

const express = require('express')
const bodyParser = require('body-parser')
const logic = require('./logic')
const jwt = require('jsonwebtoken')
const validateJwt = require('./helpers/validate-jwt')

const router = express.Router()
const jsonBodyParser = bodyParser.json()

router.post('/register', jsonBodyParser, (req, res) => {
    const { body: { email, name, password } } = req
    logic.register(email, name, password)
        .then(() => res.status(201).json({ message: 'user registered' }))
        .catch(err => {
            const { message } = err

            res.status(err instanceof Error ? 400 : 500).json({ message })
        })

})

router.post('/authenticate', jsonBodyParser, (req, res) => {
    const { body: { email, password } } = req

    logic.authenticate(email, password)
        .then(id => {
            const { JWT_SECRET, JWT_EXP } = process.env

            const token = jwt.sign({ sub: id }, JWT_SECRET, { expiresIn: JWT_EXP })

            res.json({ message: 'user authenticated', token })
        })
        .catch(err => {

            const { message } = err

            res.status(err instanceof Error ? 401 : 500).json({ message })
        })
})
//unregister
router.delete('/unregister', validateJwt, (req, res) => {
    const { body: { email, password } } = req

    logic.unregister(email, password)
        .then(() => res.json({ message: 'User deleted correctly' }))
        .catch(err => {
            const { message } = err
            res.status(err instanceof Error ? 400 : 500).json({ message })
        })
})


//add review
router.post('/user/:userId/reviews', [validateJwt, jsonBodyParser], (req, res) => {
    const { params: { userId }, body: { book, vote, comment } } = req
debugger;
    logic.addReview(userId, book, vote, comment)
        .then(() => res.json({ message: 'Review added correctly' }))
        .catch(err => {
            const { message } = err
            res.status(err instanceof Error ? 400 : 500).json({ message })
        })
})


//list reviews 

router.get('/user/:userId/reviews', validateJwt, (req, res) => {
    const { params: { userId } } = req

    logic.listReviews(userId)
        .then(res.json.bind(res))
        .catch(err => {
            const { message } = err

            res.status(err instanceof Error ? 400 : 500).json({ message })
        })


})

//delete reviews

router.delete('/user/:userId/reviews/:reviewId', validateJwt, (req, res) => {
    const { params: { reviewId, userId } } = req

    logic.deleteReviews(reviewId, userId)
        .then(() => res.json({ message: 'Review deleted correctly' }))
        .catch(err => {
            const { message } = err
            res.status(err instanceof Error ? 400 : 500).json({ message })
        })
})



//add favorites

router.post('/user/:userId/favorites', [validateJwt, jsonBodyParser], (req, res) => {
    const { params: userId, body: { book } } = req

    logic.addFavorites(userId, book)

        .then(() => res.json({ message: 'Favourite added correctly' }))
        .catch(err => {
            const { message } = err
            res.status(err instanceof Error ? 400 : 500).json({ message })
        })

})

//list favorites

router.get('/user/:userId/favorites', validateJwt, (req, res) => {
    const { params: { userId } } = req

    logic.listfavorites(userId)
        .then(res.json.bind(res))
        .catch(err => {
            const { message } = err

            res.status(err instanceof Error ? 400 : 500).json({ message })
        })


})


//delete favorites

router.delete('/user/:userId/favorites/:id', validateJwt, (req, res) => {
    const { params: { userId, bookId } } = req

    logic.deleteFavourites(userId, bookId)
        .then(() => res.json({ message: 'Favorites deleted correctly' }))
        .catch(err => {
            const { message } = err
            res.status(err instanceof Error ? 400 : 500).json({ message })
        })
})


//search 

// /user/:userId/searchbook?query=Harry Potter&searchBy=Title&orderBy=relevance
router.post('/user/:userId/searchbook', validateJwt, (req, res) => {
    const { query: { query, searchBy, orderBy } } = req

    debugger

    logic.searchBook(query, searchBy, orderBy)
        .then(books => res.json({ message: 'Search correctly',  books }))
        .catch(err => {
            const { message } = err
            res.status(err instanceof Error ? 400 : 500).json({ message })
        })
})

//saveimage
router.post('/user/:userId/saveimage', validateJwt, (req, res) => {
    const { params: { userId, base64Image } } = req

    logic.saveImageProfile(userId, base64Image)
        .then(() => res.json({ message: 'Save image correctly' }))
        .catch(err => {
            const { message } = err
            res.status(err instanceof Error ? 400 : 500).json({ message })
        })
})




module.exports = router