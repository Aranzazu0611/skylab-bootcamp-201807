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
        .then(() => {
            const { JWT_SECRET, JWT_EXP } = process.env

            const token = jwt.sign({ sub: email }, JWT_SECRET, { expiresIn: JWT_EXP })

            res.json({ message: 'user authenticated', token })
        })
        .catch(err => {

            const { message } = err

            res.status(err instanceof Error ? 401 : 500).json({ message })
        })
})
//add review
router.post('/user/:email/reviews', [validateJwt, jsonBodyParser], (req, res) => {
    const { params: { email }, body: { book, vote, comment } } = req
debugger;
    logic.addReview(email, book, vote, comment)
        .then(() => res.json({ message: 'Review added correctly' }))
        .catch(err => {
            const { message } = err
            res.status(err instanceof Error ? 400 : 500).json({ message })
        })
})


//list reviews 

router.get('/user/:id/reviews', validateJwt, (req, res) => {
    const { params: { id } } = req

    logic.listReviews(id)
        .then(res.json.bind(res))
        .catch(err => {
            const { message } = err

            res.status(err instanceof Error ? 400 : 500).json({ message })
        })


})

//delete reviews

router.delete('/user/:userId/reviews/:id', validateJwt, (req, res) => {
    const { params: { reviewId, userId } } = req

    logic.deleteReviews(reviewId, userId)
        .then(() => res.json({ message: 'Review deleted correctly' }))
        .catch(err => {
            const { message } = err
            res.status(err instanceof Error ? 400 : 500).json({ message })
        })
})



//add favorites

router.post('/user/:email/favorites', [validateJwt, jsonBodyParser], (req, res) => {
    const { params: email, body: { book } } = req

    logic.addFavorites(email, book)

        .then(() => res.json({ message: 'Favourite added correctly' }))
        .catch(err => {
            const { message } = err
            res.status(err instanceof Error ? 400 : 500).json({ message })
        })

})

//list favorites

router.get('/user/:id/favorites', validateJwt, (req, res) => {
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

router.post('/user/:email/searchbook', validateJwt, (req, res) => {
    const { params: { query, searchBy, orderBy } } = req

    logic.searchBook(query, searchBy, orderBy)
        .then(() => res.json({ message: 'Search correctly' }))
        .catch(err => {
            const { message } = err
            res.status(err instanceof Error ? 400 : 500).json({ message })
        })
})



module.exports = router