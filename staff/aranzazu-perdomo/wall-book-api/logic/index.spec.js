'user strict'

require('dotenv').config()

const logic = require('.')
const { expect } = require('chai')
const mongoose = require('mongoose')
const { Types: { ObjectId } } = mongoose
const { User, Reviews } = require('../data/models/index')

const { env: { MONGO_URL } } = process

describe('Logic', () => {

    const email = `Ara-${Math.random()}@mail.com`, name = `Ara-${Math.random()}`, password = `123-${Math.random()}`
    let _connection
    let count = 0


    before(() =>
        mongoose.connect(MONGO_URL, { useNewUrlParser: true })
            .then(conn => _connection = conn)

    )

    true && describe("validateStringField", () => {
        it('should succeed on correct value', () => {
            expect(() => logic._validateStringField('email', email).to.equal(email))
            expect(() => logic._validateStringField('password', password).to.equal(password))
        })
        it('should fail on undefined value', () => {
            expect(() => logic._validateStringField('name', undefined).to.throw('invalid name'))

        })
        it('should fail on empty value', () => {
            expect(() => logic._validateStringField('name', '').to.throw('invalid name'))

        })
        it('should fail on numeric value', () => {
            expect(() => logic._validateStringField('name', 123).to.throw('invalid name'))

        })

    })

    true && describe("Register", () => {
        it('should register correctly', () => {
            return User.findOne({ email })
                .then(user => {
                    expect(user).to.be.null
                    return logic.register(email, name, password)
                })
                .then(res => {
                    expect(res).to.be.true
                    return User.findOne({ email })
                })
                .then(user => {
                    expect(user).to.be.exist
                    expect(user.email).to.equal(email)
                    expect(user.name).to.equal(name)
                    expect(user.password).to.equal(password)

                    return User.find()
                })
                .then(users => {
                    expect(users.length).to.equal(count + 1)
                })

        })

        it('should fail on trying to register an already registered user', () => {
            return User.create({ email, name, password })
                .then(() => logic.register(email, name, password))
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal(`user with ${email} email already exist`))
        })

        it('should fail on trying to register with an undefined email', () => {
            return logic.register(undefined, name, password)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal(`invalid email`))

        })
        it('should fail on trying to register with a blank email', () => {
            return logic.register('   ', name, password)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal(`invalid email`))

        })
        it('should fail on trying to register with an empty email', () => {
            return logic.register('', name, password)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal(`invalid email`))

        })
        it('should fail on trying to register with a numeric email', () => {
            return logic.register(123, name, password)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal(`invalid email`))

        })
        it('should fail on trying to register with an undefined name', () => {
            return logic.register(email, undefined, password)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal(`invalid name`))

        })
        it('should fail on trying to register with a blank name', () => {
            return logic.register(email, '      ', password)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal(`invalid name`))

        })
        it('should fail on trying to register with an empty name', () => {
            return logic.register(email, '', password)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal(`invalid name`))

        })
        it('should fail on trying to register with an undefined password', () => {
            return logic.register(email, name, undefined)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal(`invalid password`))

        })
        it('should fail on trying to register with an empty password', () => {
            return logic.register(email, name, '')
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal(`invalid password`))

        })
        it('should fail on trying to register with a blank password', () => {
            return logic.register(email, name, '       ')
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal(`invalid password`))

        })



    })

    true && describe('authenticate user', () => {
        beforeEach(() => User.create({ email, name, password }))

        it('should login correctly', () => {
            return logic.authenticate(email, password)
                .then(res => expect(res).to.be.true)
        })
        it('should fail on trying to login with an undefined email', () => {
            return logic.authenticate(undefined, password)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal(`invalid email`))

        })
        it('should fail on trying to login with an empty email', () => {
            return logic.authenticate('', password)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal(`invalid email`))

        })
        it('should fail on trying to login with a numeric email', () => {
            return logic.authenticate(123, password)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal(`invalid email`))

        })
        it('should fail on trying to login with a blank email', () => {
            return logic.authenticate('     ', password)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal(`invalid email`))

        })
        it('should fail on trying to login with an undefined password', () => {
            return logic.authenticate(email, undefined)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal(`invalid password`))

        })
        it('should fail on trying to login with an empty password', () => {
            return logic.authenticate(email, '')
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal(`invalid password`))

        })
        it('should fail on trying to login with a blank password', () => {
            return logic.authenticate(email, '      ')
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal(`invalid password`))

        })

        true && describe('update password', () => {
            const newPassword = `${password}-${Math.random()}`

            beforeEach(() => User.create({ email, name, password }))

            it('should update password correctly', () => {
                return logic.updatePassword(email, password, newPassword)
                    .then(res => {
                        expect(res).to.be.true

                        return User.findOne({ email })
                    })
                    .then(user => {
                        expect(user).to.exist
                        expect(user.email).to.equal(email)
                        expect(user.password).to.equal(newPassword)
                    })


            })

            it('should fail on trying to update password with an undefined email', () => {
                return logic.updatePassword(undefined, password, newPassword)
                    .catch(err => err)
                    .then(({ message }) => expect(message).to.equal(`invalid email`))

            })
            it('should fail on trying to update password with an empty email', () => {
                return logic.updatePassword('', password, newPassword)
                    .catch(err => err)
                    .then(({ message }) => expect(message).to.equal(`invalid email`))

            })
            it('should fail on trying to update password with a blank email', () => {
                return logic.updatePassword('     ', password, newPassword)
                    .catch(err => err)
                    .then(({ message }) => expect(message).to.equal(`invalid email`))

            })
            it('should fail on trying to update password with a numeric email', () => {
                return logic.updatePassword(123, password, newPassword)
                    .catch(err => err)
                    .then(({ message }) => expect(message).to.equal(`invalid email`))

            })
            it('should fail on trying to update password with an undefined password', () => {
                return logic.updatePassword(email, undefined, newPassword)
                    .catch(err => err)
                    .then(({ message }) => expect(message).to.equal(`password undefined`))

            })
            it('should fail on trying to update password with an empty password', () => {
                return logic.updatePassword(email, '', newPassword)
                    .catch(err => err)
                    .then(({ message }) => expect(message).to.equal(`password empty`))

            })
            it('should fail on trying to update password with a blank password', () => {
                return logic.updatePassword(email, '     ', newPassword)
                    .catch(err => err)
                    .then(({ message }) => expect(message).to.equal(`password is a blank`))

            })
            it('should fail on trying to update password with an undefined new password', () => {
                return logic.updatePassword(email, password, undefined)
                    .catch(err => err)
                    .then(({ message }) => expect(message).to.equal(`new password is undefined`))

            })
            it('should fail on trying to update password with an empty new password', () => {
                return logic.updatePassword(email, password, '')
                    .catch(err => err)
                    .then(({ message }) => expect(message).to.equal(`new password is empty`))

            })
            it('should fail on trying to update password with a blank new password', () => {
                return logic.updatePassword(email, password, '     ')
                    .catch(err => err)
                    .then(({ message }) => expect(message).to.equal(`new password is a blank`))

            })
        })

        !true && describe('unregister', () => {
            beforeEach(() => User.create({ email, name, password }))
            it('should unregister user correctly', () => {
                return logic.unregister(email, password)
                    .then(res => {
                        expect(res).to.be.true

                        return User.findOne({ email })
                    })
                    .then(user => {
                        expect(user).to.not.exist
                    })


            })

            it('should fail on trying to unregister user with an undefined email', () => {
                return logic.unregister(undefined, password)
                    .catch(err => err)
                    .then(({ message }) => expect(message).to.equal(`email is undefined`))

            })
            it('should fail on trying to unregister user with an empty email', () => {
                return logic.unregister('', password)
                    .catch(err => err)
                    .then(({ message }) => expect(message).to.equal(`email is empty`))

            })
            it('should fail on trying to unregister user with a numeric email', () => {
                return logic.unregister(123, password)
                    .catch(err => err)
                    .then(({ message }) => expect(message).to.equal(`email is a number`))

            })
            it('should fail on trying to unregister user with a blank email', () => {
                return logic.unregister('     ', password)
                    .catch(err => err)
                    .then(({ message }) => expect(message).to.equal(`email is a blank`))

            })
        })
    })



    afterEach(() => User.deleteMany())

    after(() =>
        Promise.all([

            User.deleteMany(),
            Reviews.deleteMany(),


        ])
            .then(() => _connection.disconnect())
    )
})