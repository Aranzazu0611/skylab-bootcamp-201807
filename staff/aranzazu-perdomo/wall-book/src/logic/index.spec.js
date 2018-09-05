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
    

    !true && describe('validate fields', () => {
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
    !true && describe('register user', () => {
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

    !true && describe('authenticate user', () => {
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
        let user, token, email, name, password,newPassword
       
        
        beforeEach(() => {
            email = `Aranzazu-${Math.random()}@gmail.com`
            name = `Aranzazu-${Math.random()}`
            password = `123456-${Math.random()}`
            newPassword = `123456-${Math.random()}`

            return logicWallbook.register(email, name, password)
                .then(() =>
                    logicWallbook.authenticate(email, password)
                        .then(({ message, token: _token, user: _user }) => {
                            user = _user
                            token = _token
                        })
                )
        })

        it('should update password correctly', () =>
            logicWallbook.updatePassword(email, password, newPassword, token)
                .catch(({ message }) => expect(message).to.be.undefined)
                .then(res => expect(res).to.be.true)
        )
    })

    !true && describe('unregister user', () => {
        it('should unregister correctly', () =>
            logicWallbook.unregister(email, password)
                .catch(({ message }) => expect(message).to.be.undefined)
                .then(res => expect(res).to.be.true)
        )

        it('should fail on trying to unregister with undefined email', () =>
            logicWallbook.unregister(undefined, password)
                .catch(({ message }) => message)
                .then(message => expect(message).to.equal('invalid email'))
        )

        it('should fail on trying to unregister with empty email', () =>
            logicWallbook.unregister('', password)
                .catch(({ message }) => message)
                .then(message => expect(message).to.equal('invalid email'))
        )

        it('should fail on trying to unregister with a numeric email', () =>
            logicWallbook.unregister(12345, password)
                .catch(({ message }) => message)
                .then(message => expect(message).to.equal('invalid email'))
        )

        it('should fail on trying to unregister with a blank email', () =>
            logicWallbook.unregister('   ', password)
                .catch(({ message }) => message)
                .then(message => expect(message).to.equal('invalid email'))
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

    !true && describe('add review', () => {
        let email, name, password

        const book = "Harry Potter"
        const _vote = '10'
        const comment = 'fantastic'

        let user, token

        beforeEach(() => {
            email = `Aranzazu-${Math.random()}@gmail.com`
            name = `Aranzazu-${Math.random()}`
            password = `123456-${Math.random()}`

            return logicWallbook.register(email, name, password)
                .then(() =>
                    logicWallbook.authenticate(email, password)
                        .then(({ message, token: _token, user: _user }) => {
                            user = _user
                            token = _token
                        })
                )
        })

        it('should add review correctly', () =>
            logicWallbook.addReview(user, book, _vote, comment, token)
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
            logicWallbook.addReview(user, undefined, _vote, comment, token)
                .catch(({ message }) => message)
                .then(message => expect(message).to.equal('invalid book'))
        )

        it('should fail on trying to add review with an empty book', () =>
            logicWallbook.addReview(user, '', _vote, comment, token)
                .catch(({ message }) => message)
                .then(message => expect(message).to.equal('invalid book'))
        )

        it('should fail on trying to add review with a blank book', () =>
            logicWallbook.addReview(user, '     ', _vote, comment, token)
                .catch(({ message }) => message)
                .then(message => expect(message).to.equal('invalid book'))
        )

        it('should fail on trying to add review with a numeric book', () =>
            logicWallbook.addReview(user, 12345, _vote, comment, token)
                .catch(({ message }) => message)
                .then(message => expect(message).to.equal('invalid book'))
        )

        it('should fail on trying to add review with an undefined vote', () =>
            logicWallbook.addReview(user, book, undefined, comment, token)
                .catch(({ message }) => message)
                .then(message => expect(message).to.equal('invalid vote'))
        )

        it('should fail on trying to add review with an empty vote', () =>
            logicWallbook.addReview(user, book, '', comment, token)
                .catch(({ message }) => message)
                .then(message => expect(message).to.equal('invalid vote'))
        )

        it('should fail on trying to add review with a blank vote', () =>
            logicWallbook.addReview(user, book, '    ', comment, token)
                .catch(({ message }) => message)
                .then(message => expect(message).to.equal('invalid vote'))
        )

        it('should fail on trying to add review with an undefined comment', () =>
            logicWallbook.addReview(user, book, _vote, undefined, token)
                .catch(({ message }) => message)
                .then(message => expect(message).to.equal('invalid comment'))
        )

        it('should fail on trying to add review with an empty comment', () =>
            logicWallbook.addReview(user, book, _vote, '', token)
                .catch(({ message }) => message)
                .then(message => expect(message).to.equal('invalid comment'))
        )

        it('should fail on trying to add review with a blank comment', () =>
            logicWallbook.addReview(user, book, _vote, '      ', token)
                .catch(({ message }) => message)
                .then(message => expect(message).to.equal('invalid comment'))
        )

        it('should fail on trying to add review with a numeric comment', () =>
            logicWallbook.addReview(user, book, _vote, 12345, token)
                .catch(({ message }) => message)
                .then(message => expect(message).to.equal('invalid comment'))
        )

    })

    !true && describe('list review', () => {
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
        })

        it('should list review correctly', () =>
            logicWallbook.listReviews(userId, token)
                .catch(({ message }) => expect(message).to.be.undefined)
                .then((reviews) => expect(reviews).to.exist)
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

    })

    !true && describe('delete review', () => {
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
        })

        it('should delete review', () =>
            logicWallbook.deleteReviews(reviewId, userId, token)
                .catch(({ message }) => expect(message).to.be.undefined)
                .then(res => expect(res).to.be.true)

        )

    })


})




