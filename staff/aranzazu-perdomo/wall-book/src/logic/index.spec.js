'use strict'

require('dotenv').config()

require('isomorphic-fetch')

const { expect } = require('chai')
const logicWallbook = require('../logic')
const jwt = require('jsonwebtoken')

describe('logic', () => {
    const email = `Aranzazu-${Math.random()}@gmail.com`
    const name = `Aranzazu-${Math.random()}`
    const password = `123456-${Math.random()}`


    true && describe('validate fields', () => {
        it('should succeed on correct value', () => {
            expect(() => logicWallbook._validateEmail(email)).not.to.throw()
            expect(() => logicWallbook._validateStringField('password', password)).not.to.throw()
            expect(() => logicWallbook._validateStringField('name', name)).not.to.throw()
        })

        it('should fail on undefined value', () => {
            expect(() => logicWallbook._validateEmail(undefined)).to.throw(`invalid email`)
        })

        it('should fail on empty value', () => {
            expect(() => logicWallbook._validateEmail('')).to.throw(`invalid email`)
        })

        it('should fail on blank value', () => {
            expect(() => logicWallbook._validateEmail('    ')).to.throw(`invalid email`)
        })

        it('should fail on numeric value', () => {
            expect(() => logicWallbook._validateEmail('12345')).to.throw(`invalid email`)
        })

        it('should fail on undefined value', () => {
            expect(() => logicWallbook._validateStringField('name', undefined)).to.throw(`invalid name`)
        })

        it('should fail on numeric value', () => {
            expect(() => logicWallbook._validateStringField('name', 12345)).to.throw(`invalid name`)
        })

        it('should fail on empty value', () => {
            expect(() => logicWallbook._validateStringField('name', '')).to.throw(`invalid name`)
        })

        it('should fail on blank value', () => {
            expect(() => logicWallbook._validateStringField('name', '    ')).to.throw(`invalid name`)
        })

    })

    true && describe('register user', () => {
        it('should register correctly', () =>
            logicWallbook.register(email, name, password)
                .catch(({ message }) => expect(message).to.be.undefined)
                .then(res => expect(res).to.be.true)
        )

        it('should fail on undefined email', () =>
            logicWallbook.register(undefined, name, password)
                .catch(({ message }) => message)
                .then(message => expect(message).to.equal('invalid email'))
        )

        it('should fail on empty email', () =>
            logicWallbook.register('', name, password)
                .catch(({ message }) => message)
                .then(message => expect(message).to.equal('invalid email'))
        )

        it('should fail on blank email', () =>
            logicWallbook.register('     ', name, password)
                .catch(({ message }) => message)
                .then(message => expect(message).to.equal('invalid email'))
        )

        it('should fail on numeric email', () =>
            logicWallbook.register('     ', name, password)
                .catch(({ message }) => message)
                .then(message => expect(message).to.equal('invalid email'))
        )

        it('should fail on undefined name', () =>
            logicWallbook.register(email, undefined, password)
                .catch(({ message }) => message)
                .then(message => expect(message).to.equal('invalid name'))
        )

        it('should fail on empty name', () =>
            logicWallbook.register(email, '', password)
                .catch(({ message }) => message)
                .then(message => expect(message).to.equal('invalid name'))
        )

        it('should fail on blank name', () =>
            logicWallbook.register(email, '    ', password)
                .catch(({ message }) => message)
                .then(message => expect(message).to.equal('invalid name'))
        )

        it('should fail on numeric name', () =>
            logicWallbook.register(email, 12345, password)
                .catch(({ message }) => message)
                .then(message => expect(message).to.equal('invalid name'))
        )

        it('should fail on undefined password', () =>
            logicWallbook.register(email, name, undefined)
                .catch(({ message }) => message)
                .then(message => expect(message).to.equal('invalid password'))
        )

        it('should fail on empty password', () =>
            logicWallbook.register(email, name, '')
                .catch(({ message }) => message)
                .then(message => expect(message).to.equal('invalid password'))
        )

        it('should fail on blank password', () =>
            logicWallbook.register(email, name, '    ')
                .catch(({ message }) => message)
                .then(message => expect(message).to.equal('invalid password'))
        )
    })

    true && describe('authenticate user', () => {
        it('should authenticate correctly', () =>
            logicWallbook.authenticate(email, password)
                .catch(({ message }) => expect(message).to.be.undefined)
                .then(({ message, token, user }) => {
                    expect(token).to.exist
                    expect(user).to.exist

                    expect(message).to.equal(message)
                })
        )

        it('should fail on trying to authenticate with undefined email', () =>
            logicWallbook.authenticate(undefined, password)
                .catch(({ message }) => message)
                .then(message => expect(message).to.equal('invalid email'))
        )

        it('should fail on trying to authenticate with empty email', () =>
            logicWallbook.authenticate('', password)
                .catch(({ message }) => message)
                .then(message => expect(message).to.equal('invalid email'))
        )

        it('should fail on trying to authenticate with a blank email', () =>
            logicWallbook.authenticate('   ', password)
                .catch(({ message }) => message)
                .then(message => expect(message).to.equal('invalid email'))
        )

        it('should fail on trying to authenticate with a numeric email', () =>
            logicWallbook.authenticate(12345, password)
                .catch(({ message }) => message)
                .then(message => expect(message).to.equal('invalid email'))
        )

        it('should fail on trying to authenticate with undefined password', () =>
            logicWallbook.authenticate(email, undefined)
                .catch(({ message }) => message)
                .then(message => expect(message).to.equal('invalid password'))
        )

        it('should fail on trying to authenticate with empty password', () =>
            logicWallbook.authenticate(email, '')
                .catch(({ message }) => message)
                .then(message => expect(message).to.equal('invalid password'))
        )

        it('should fail on trying to authenticate with a blank password', () =>
            logicWallbook.authenticate(email, '    ')
                .catch(({ message }) => message)
                .then(message => expect(message).to.equal('invalid password'))
        )
    })

    true && describe('update password', () => {
        let userId, token, email, name, password, newPassword


        beforeEach(() => {
            email = `Aranzazu-${Math.random()}@gmail.com`
            name = `Aranzazu-${Math.random()}`
            password = `123456-${Math.random()}`
            newPassword = `123456-${Math.random()}`

            return logicWallbook.register(email, name, password)
                .then(() =>
                    logicWallbook.authenticate(email, password)
                        .then(({ message, token: _token, user: _user }) => {

                            userId = _user
                            token = _token
                        })
                )
        })

        it('should update password correctly', () =>
            logicWallbook.updatePassword(userId, password, newPassword, token)
                .catch(({ message }) => expect(message).to.be.undefined)
                .then(res => expect(res).to.be.true)
        )

        it('should fail on trying to update with undefined userId', () =>
            logicWallbook.updatePassword(undefined, password, newPassword, token)
                .catch(({ message }) => message)
                .then(message => expect(message).to.equal('invalid userId'))
        )

        it('should fail on trying to update with an empty userId', () =>
            logicWallbook.updatePassword('', password, newPassword, token)
                .catch(({ message }) => message)
                .then(message => expect(message).to.equal('invalid userId'))
        )

        it('should fail on trying to update with an blank userId', () =>
            logicWallbook.updatePassword('     ', password, newPassword, token)
                .catch(({ message }) => message)
                .then(message => expect(message).to.equal('invalid userId'))
        )

        it('should fail on trying to update with an undefined password', () =>
            logicWallbook.updatePassword(userId, undefined, newPassword, token)
                .catch(({ message }) => message)
                .then(message => expect(message).to.equal('invalid password'))
        )

        it('should fail on trying to update with an empty password', () =>
            logicWallbook.updatePassword(userId, '', newPassword, token)
                .catch(({ message }) => message)
                .then(message => expect(message).to.equal('invalid password'))
        )

        it('should fail on trying to update with a blank password', () =>
            logicWallbook.updatePassword(userId, '     ', newPassword, token)
                .catch(({ message }) => message)
                .then(message => expect(message).to.equal('invalid password'))
        )

        it('should fail on trying to update with an undefined new password', () =>
            logicWallbook.updatePassword(userId, password, undefined, token)
                .catch(({ message }) => message)
                .then(message => expect(message).to.equal('invalid newPassword'))
        )

        it('should fail on trying to update with an empty new password', () =>
            logicWallbook.updatePassword(userId, password, '', token)
                .catch(({ message }) => message)
                .then(message => expect(message).to.equal('invalid newPassword'))
        )

        it('should fail on trying to update with a blank new password', () =>
            logicWallbook.updatePassword(userId, password, '    ', token)
                .catch(({ message }) => message)
                .then(message => expect(message).to.equal('invalid newPassword'))
        )

        it('should fail on trying to update with an undefined token', () =>
            logicWallbook.updatePassword(userId, password, newPassword, undefined)
                .catch(({ message }) => message)
                .then(message => expect(message).to.equal('invalid token'))
        )

        it('should fail on trying to update with an empty token', () =>
            logicWallbook.updatePassword(userId, password, newPassword, '')
                .catch(({ message }) => message)
                .then(message => expect(message).to.equal('invalid token'))
        )

        it('should fail on trying to update with a blank token', () =>
            logicWallbook.updatePassword(userId, password, newPassword, '')
                .catch(({ message }) => message)
                .then(message => expect(message).to.equal('invalid token'))
        )



    })

    true && describe('unregister user', () => {
        let userId, email, name, password, token

        beforeEach(() => {
            email = `Aranzazu-${Math.random()}@gmail.com`
            name = `Aranzazu-${Math.random()}`
            password = `123456-${Math.random()}`

            return logicWallbook.register(email, name, password)
                .then(() =>
                    logicWallbook.authenticate(email, password)
                        .then(({ message, token: _token, user: _user }) => {
                            userId = _user
                            token = _token
                        })
                )
        })

        it('should unregister correctly', () =>
            logicWallbook.unregister(userId, password)
                .catch(({ message }) => expect(message).to.be.undefined)
                .then(res => expect(res).to.be.true)
        )

        it('should fail on trying to unregister with undefined userId', () =>
            logicWallbook.unregister(undefined, password)
                .catch(({ message }) => message)
                .then(message => expect(message).to.equal('invalid userId'))
        )

        it('should fail on trying to unregister with empty userId', () =>
            logicWallbook.unregister('', password)
                .catch(({ message }) => message)
                .then(message => expect(message).to.equal('invalid userId'))
        )

        it('should fail on trying to unregister with a numeric userId', () =>
            logicWallbook.unregister(12345, password)
                .catch(({ message }) => message)
                .then(message => expect(message).to.equal('invalid userId'))
        )

        it('should fail on trying to unregister with a blank userId', () =>
            logicWallbook.unregister('   ', password)
                .catch(({ message }) => message)
                .then(message => expect(message).to.equal('invalid userId'))
        )

        it('should fail on trying to unregister with undefined password', () =>
            logicWallbook.unregister(email, undefined)
                .catch(({ message }) => message)
                .then(message => expect(message).to.equal('invalid password'))
        )

        it('should fail on trying to unregister with an empty password', () =>
            logicWallbook.unregister(email, '')
                .catch(({ message }) => message)
                .then(message => expect(message).to.equal('invalid password'))
        )

        it('should fail on trying to unregister with an blank password', () =>
            logicWallbook.unregister(email, '     ')
                .catch(({ message }) => message)
                .then(message => expect(message).to.equal('invalid password'))
        )
    })

    true && describe('add review', () => {
        let email, name, password

        const book = "Harry Potter"
        const _vote = '10'
        const comment = 'fantastic'

        let userId, token

        beforeEach(() => {
            email = `Aranzazu-${Math.random()}@gmail.com`
            name = `Aranzazu-${Math.random()}`
            password = `123456-${Math.random()}`

            return logicWallbook.register(email, name, password)
                .then(() =>
                    logicWallbook.authenticate(email, password)
                        .then(({ message, token: _token, user: _user }) => {
                            userId = _user
                            token = _token
                        })
                )
        })

        it('should add review correctly', () =>
            logicWallbook.addReview(userId, book, _vote, comment, token)
                .catch(({ message }) => expect(message).to.be.undefined)
                .then(({ message }) => expect(message).to.equal('Review added correctly'))
        )

        it('should fail on trying to add review with undefined userId', () =>
            logicWallbook.addReview(undefined, book, _vote, comment, token)
                .catch(({ message }) => message)
                .then(message => expect(message).to.equal('invalid userId'))
        )

        it('should fail on trying to add review with an empty userId', () =>
            logicWallbook.addReview('', book, _vote, comment, token)
                .catch(({ message }) => message)
                .then(message => expect(message).to.equal('invalid userId'))
        )

        it('should fail on trying to add review with a blank userId', () =>
            logicWallbook.addReview('    ', book, _vote, comment, token)
                .catch(({ message }) => message)
                .then(message => expect(message).to.equal('invalid userId'))
        )

        it('should fail on trying to add review with an undefined book', () =>
            logicWallbook.addReview(userId, undefined, _vote, comment, token)
                .catch(({ message }) => message)
                .then(message => expect(message).to.equal('invalid book'))
        )

        it('should fail on trying to add review with an empty book', () =>
            logicWallbook.addReview(userId, '', _vote, comment, token)
                .catch(({ message }) => message)
                .then(message => expect(message).to.equal('invalid book'))
        )

        it('should fail on trying to add review with a blank book', () =>
            logicWallbook.addReview(userId, '     ', _vote, comment, token)
                .catch(({ message }) => message)
                .then(message => expect(message).to.equal('invalid book'))
        )

        it('should fail on trying to add review with a numeric book', () =>
            logicWallbook.addReview(userId, 12345, _vote, comment, token)
                .catch(({ message }) => message)
                .then(message => expect(message).to.equal('invalid book'))
        )

        it('should fail on trying to add review with an undefined vote', () =>
            logicWallbook.addReview(userId, book, undefined, comment, token)
                .catch(({ message }) => message)
                .then(message => expect(message).to.equal('invalid vote'))
        )

        it('should fail on trying to add review with an empty vote', () =>
            logicWallbook.addReview(userId, book, '', comment, token)
                .catch(({ message }) => message)
                .then(message => expect(message).to.equal('invalid vote'))
        )

        it('should fail on trying to add review with a blank vote', () =>
            logicWallbook.addReview(userId, book, '    ', comment, token)
                .catch(({ message }) => message)
                .then(message => expect(message).to.equal('invalid vote'))
        )

        it('should fail on trying to add review with an undefined comment', () =>
            logicWallbook.addReview(userId, book, _vote, undefined, token)
                .catch(({ message }) => message)
                .then(message => expect(message).to.equal('invalid comment'))
        )

        it('should fail on trying to add review with an empty comment', () =>
            logicWallbook.addReview(userId, book, _vote, '', token)
                .catch(({ message }) => message)
                .then(message => expect(message).to.equal('invalid comment'))
        )

        it('should fail on trying to add review with a blank comment', () =>
            logicWallbook.addReview(userId, book, _vote, '      ', token)
                .catch(({ message }) => message)
                .then(message => expect(message).to.equal('invalid comment'))
        )

        it('should fail on trying to add review with a numeric comment', () =>
            logicWallbook.addReview(userId, book, _vote, 12345, token)
                .catch(({ message }) => message)
                .then(message => expect(message).to.equal('invalid comment'))
        )

    })

    true && describe('list review', () => {
        const book = "Harry Potter"
        const _vote = '10'
        const comment = 'fantastic'

        let email, name, password, userId, token

        beforeEach(() => {
            email = `Aranzazu-${Math.random()}@gmail.com`
            name = `Aranzazu-${Math.random()}`
            password = `123456-${Math.random()}`

            return logicWallbook.register(email, name, password)
                .then(() =>
                    logicWallbook.authenticate(email, password)
                        .then(({ message, token: _token, user: _user }) => {
                            userId = _user
                            token = _token
                        })
                )
                .then(() => logicWallbook.addReview(userId, book, _vote, comment, token))
        })

        it('should list review correctly', () =>
            logicWallbook.listReviews(userId, token)
                .catch(({ message }) => expect(message).to.be.undefined)
                .then((reviews) => {
                    expect(reviews).to.exist
                    expect(reviews.length).to.equal(1)
                })
        )

        it('should fail on trying to list review with an undefined userId', () =>
            logicWallbook.listReviews(undefined, token)
                .catch(({ message }) => message)
                .then(message => expect(message).to.equal('invalid userId'))
        )

        it('should fail on trying to list review with an empty userId', () =>
            logicWallbook.listReviews('', token)
                .catch(({ message }) => message)
                .then(message => expect(message).to.equal('invalid userId'))
        )

        it('should fail on trying to list review with a blank userId', () =>
            logicWallbook.listReviews('      ', token)
                .catch(({ message }) => message)
                .then(message => expect(message).to.equal('invalid userId'))
        )

        it('should fail on trying to list review with an undefined token', () =>
            logicWallbook.listReviews(userId, undefined)
                .catch(({ message }) => message)
                .then(message => expect(message).to.equal('invalid token'))
        )

        it('should fail on trying to list review with a blank token', () =>
            logicWallbook.listReviews(userId, '     ')
                .catch(({ message }) => message)
                .then(message => expect(message).to.equal('invalid token'))
        )

        it('should fail on trying to list review with an empty userId', () =>
            logicWallbook.listReviews(userId, '')
                .catch(({ message }) => message)
                .then(message => expect(message).to.equal('invalid token'))
        )

    })

    true && describe('delete review', () => {
        const book = "Harry Potter"
        const _vote = '10'
        const comment = 'fantastic'

        let email, name, password, userId, token, reviewId

        beforeEach(() => {
            email = `Aranzazu-${Math.random()}@gmail.com`
            name = `Aranzazu-${Math.random()}`
            password = `123456-${Math.random()}`

            return logicWallbook.register(email, name, password)
                .then(() =>
                    logicWallbook.authenticate(email, password)
                        .then(({ message, token: _token, user: _user }) => {
                            userId = _user
                            token = _token
                        })
                )
                .then(() => logicWallbook.addReview(userId, book, _vote, comment, token))
                .then(res => {
                    expect(res).to.exist

                    return logicWallbook.listReviews(userId, token)
                })
                .then(res => reviewId = res[0]._id)

        })

        it('should delete review', () =>
            logicWallbook.deleteReviews(reviewId, userId, token)
                .then(res => expect(res).to.be.true)
        )

        it('should delete review and do not throw error', () =>
            logicWallbook.deleteReviews(reviewId, userId, token)
                .catch(({ message }) => expect(message).to.be.undefined)
                .then(res => expect(res).to.be.true)
        )

        it('should fail on trying to delete reviews with an undefined reviewId', () =>
            logicWallbook.deleteReviews(undefined, userId, token)
                .catch(({ message }) => message)
                .then(message => expect(message).to.equal('invalid reviewId'))
        )

        it('should fail on trying to delete reviews with an empty reviewId', () =>
            logicWallbook.deleteReviews('', userId, token)
                .catch(({ message }) => message)
                .then(message => expect(message).to.equal('invalid reviewId'))
        )

        it('should fail on trying to delete reviews with a blank reviewId', () =>
            logicWallbook.deleteReviews('     ', userId, token)
                .catch(({ message }) => message)
                .then(message => expect(message).to.equal('invalid reviewId'))
        )

        it('should fail on trying to delete reviews with an undefined userId', () =>
            logicWallbook.deleteReviews(reviewId, undefined, token)
                .catch(({ message }) => message)
                .then(message => expect(message).to.equal('invalid userId'))
        )

        it('should fail on trying to delete reviews with an empty userId', () =>
            logicWallbook.deleteReviews(reviewId, '', token)
                .catch(({ message }) => message)
                .then(message => expect(message).to.equal('invalid userId'))
        )

        it('should fail on trying to delete reviews with a blank userId', () =>
            logicWallbook.deleteReviews(reviewId, '     ', token)
                .catch(({ message }) => message)
                .then(message => expect(message).to.equal('invalid userId'))
        )

        it('should fail on trying to delete reviews with an undefined token', () =>
            logicWallbook.deleteReviews(reviewId, userId, undefined)
                .catch(({ message }) => message)
                .then(message => expect(message).to.equal('invalid token'))
        )

        it('should fail on trying to delete reviews with an empty token', () =>
            logicWallbook.deleteReviews(reviewId, userId, '')
                .catch(({ message }) => message)
                .then(message => expect(message).to.equal('invalid token'))
        )
        it('should fail on trying to delete reviews with a blank token', () =>
            logicWallbook.deleteReviews(reviewId, userId, '     ')
                .catch(({ message }) => message)
                .then(message => expect(message).to.equal('invalid token'))
        )

    })

    true && describe('add favorite', () => {
        let email, name, password
        let userId, token

        const bookId = "9KJJYFIss_wC"


        beforeEach(() => {
            email = `Aranzazu-${Math.random()}@gmail.com`
            name = `Aranzazu-${Math.random()}`
            password = `123456-${Math.random()}`

            return logicWallbook.register(email, name, password)
                .then(() =>
                    logicWallbook.authenticate(email, password)
                        .then(({ message, token: _token, user: _user }) => {
                            userId = _user
                            token = _token
                        })
                )
        })

        it('should add favorite correctly', () =>
            logicWallbook.addFavorite(userId, bookId, token)
                .catch(({ message }) => expect(message).to.be.undefined)
                .then(({ message }) => expect(message).to.equal('Favourite added correctly'))
        )

        it('should fail on trying to add favorite with an undefined userId', () =>
            logicWallbook.addFavorite(undefined, bookId, token)
                .catch(({ message }) => message)
                .then(message => expect(message).to.equal('invalid userId'))
        )

        it('should fail on trying to add favorite with an empty userId', () =>
            logicWallbook.addFavorite('', bookId, token)
                .catch(({ message }) => message)
                .then(message => expect(message).to.equal('invalid userId'))
        )

        it('should fail on trying to add favorite with a blank userId', () =>
            logicWallbook.addFavorite('   ', bookId, token)
                .catch(({ message }) => message)
                .then(message => expect(message).to.equal('invalid userId'))
        )

        it('should fail on trying to add favorite with an undefined bookId', () =>
            logicWallbook.addFavorite(userId, undefined, token)
                .catch(({ message }) => message)
                .then(message => expect(message).to.equal('invalid bookId'))
        )

        it('should fail on trying to add favorite with an empty bookId', () =>
            logicWallbook.addFavorite(userId, '', token)
                .catch(({ message }) => message)
                .then(message => expect(message).to.equal('invalid bookId'))
        )

        it('should fail on trying to add favorite with a blank bookId', () =>
            logicWallbook.addFavorite(userId, '      ', token)
                .catch(({ message }) => message)
                .then(message => expect(message).to.equal('invalid bookId'))
        )

        it('should fail on trying to add favorite with a numeric bookId', () =>
            logicWallbook.addFavorite(userId, 1234, token)
                .catch(({ message }) => message)
                .then(message => expect(message).to.equal('invalid bookId'))
        )

        it('should fail on trying to add favorite with a undefined token', () =>
            logicWallbook.addFavorite(userId, bookId, undefined)
                .catch(({ message }) => message)
                .then(message => expect(message).to.equal('invalid token'))
        )

        it('should fail on trying to add favorite with an empty token', () =>
            logicWallbook.addFavorite(userId, bookId, '')
                .catch(({ message }) => message)
                .then(message => expect(message).to.equal('invalid token'))
        )

        it('should fail on trying to add favorite with a blank token', () =>
            logicWallbook.addFavorite(userId, bookId, '      ')
                .catch(({ message }) => message)
                .then(message => expect(message).to.equal('invalid token'))
        )

    })

    true && describe('list favorites', () => {
        let email, name, password
        let userId, token

        const book = "Harry Potter"


        beforeEach(() => {
            email = `Aranzazu-${Math.random()}@gmail.com`
            name = `Aranzazu-${Math.random()}`
            password = `123456-${Math.random()}`

            return logicWallbook.register(email, name, password)
                .then(() => logicWallbook.authenticate(email, password))
                .then(({ message, token: _token, user: _user }) => {
                    userId = _user
                    token = _token
                })
                .then(() => logicWallbook.addFavorite(userId, book, token))
        })

        it('should list favorites correctly', () =>
            logicWallbook.listFavorites(userId, token)
                .catch(({ message }) => expect(message).to.be.undefined)
                .then(favorites => {
                    expect(favorites).to.exist
                    expect(favorites.length).to.equal(1)
                })
        )

        it('should fail on trying to list favorites with an undefined userId', () =>
            logicWallbook.listFavorites(undefined, token)
                .catch(({ message }) => message)
                .then(message => expect(message).to.equal('invalid userId'))
        )

        it('should fail on trying to list favorites with an empty userId', () =>
            logicWallbook.listFavorites('', token)
                .catch(({ message }) => message)
                .then(message => expect(message).to.equal('invalid userId'))
        )

        it('should fail on trying to list favorites with a blank userId', () =>
            logicWallbook.listFavorites('     ', token)
                .catch(({ message }) => message)
                .then(message => expect(message).to.equal('invalid userId'))
        )

        it('should fail on trying to list favorites with an undefined token', () =>
            logicWallbook.listFavorites(userId, undefined)
                .catch(({ message }) => message)
                .then(message => expect(message).to.equal('invalid token'))

        )

        it('should fail on trying to list favorites with an empty token', () =>
            logicWallbook.listFavorites(userId, '')
                .catch(({ message }) => message)
                .then(message => expect(message).to.equal('invalid token'))
        )

        it('should fail on trying to list favorites with a blank token', () =>
            logicWallbook.listFavorites(userId, '     ')
                .catch(({ message }) => message)
                .then(message => expect(message).to.equal('invalid token'))
        )

    })

    true && describe('delete favorite', () => {
        let email, name, password
        let userId, token

        const bookId = "9KJJYFIss_wC"

        beforeEach(() => {
            email = `Aranzazu-${Math.random()}@gmail.com`
            name = `Aranzazu-${Math.random()}`
            password = `123456-${Math.random()}`

            return logicWallbook.register(email, name, password)
                .then(() =>
                    logicWallbook.authenticate(email, password)
                )
                .then(({ message, token: _token, user: _user }) => {
                    userId = _user
                    token = _token
                })
                .then(() => logicWallbook.addFavorite(userId, bookId, token))
        })

        it('should delete favorites correctly', () =>
            logicWallbook.deleteFavorite(userId, bookId, token)
                .catch(({ message }) => expect(message).to.be.undefined)
                .then(res => expect(res).to.be.true)
        )


    })

    true && describe('search book', () => {
        let email, name, password, token, query, searchBy, orderBy, userId

        query = "Harry Potter"

        beforeEach(() => {
            email = `Aranzazu-${Math.random()}@gmail.com`
            name = `Aranzazu-${Math.random()}`
            password = `123456-${Math.random()}`

            return logicWallbook.register(email, name, password)
                .then(() =>
                    logicWallbook.authenticate(email, password)
                        .then(({ message, token: _token, user: _user }) => {
                            userId = _user
                            token = _token
                        })
                )

        })

        it('should search book correctly', () =>
            logicWallbook.searchBook(query, searchBy = 'title', orderBy = 'relevance', token)
                .catch(({ message }) => expect(message).to.be.undefined)
                .then(searchs => {
                    expect(searchs).to.exist
                    expect(searchs.length).to.equal(1)
                })

        )




    })

    true && describe('save images', () => {
        let email, name, password
        let userId, token

        beforeEach(() => {
            email = `Aranzazu-${Math.random()}@gmail.com`
            name = `Aranzazu-${Math.random()}`
            password = `123456-${Math.random()}`

            return logicWallbook.register(email, name, password)
                .then(() =>
                    logicWallbook.authenticate(email, password)
                        .then(({ message, token: _token, user: _user }) => {
                            userId = _user
                            token = _token
                        })
                )
        })

        it('should save image correctly', () =>
            logicWallbook.saveImageProfile(userId, base64Image, token)
                .catch(({ message }) => expect(message).to.be.undefined)
                .then(({ message }) => expect(message).to.equal('Delete favorites correctly'))
        )




    })

    true && describe('Retrive BookId', () => {
        let email, name, password
        let userId, token

        const bookId = '9KJJYFIss_wC'

        beforeEach(() => {
            email = `Aranzazu-${Math.random()}@gmail.com`
            name = `Aranzazu-${Math.random()}`
            password = `123456-${Math.random()}`

            return logicWallbook.register(email, name, password)
                .then(() =>
                    logicWallbook.authenticate(email, password)
                        .then(({ message, token: _token, user: _user }) => {
                            userId = _user
                            token = _token
                        })
                )
        })

        it('should retrieve book id correctly', () =>
        logicWallbook.retrieveBook(bookId, token)
            .catch(({ message }) => expect(message).to.be.undefined)
            .then(({ message }) => expect(message).to.equal('Retrieve book correctly'))
    )
    })



})
