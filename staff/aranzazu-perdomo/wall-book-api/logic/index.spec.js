'user strict'

require('dotenv').config()

const logic = require('.')
const { expect } = require('chai')
const mongoose = require('mongoose')
const { Types: { ObjectId } } = mongoose
const { User, Review } = require('../data/models/index')

const { env: { MONGO_URL } } = process

describe('Logic', () => {

    const email = `Ara-${Math.random()}@mail.com`, name = `Ara-${Math.random()}`, password = `123-${Math.random()}`
    let _connection
    let count = 0


    before(() =>
        mongoose.connect(MONGO_URL, { useNewUrlParser: true })
            .then(conn => _connection = conn)
            .then(() => User.deleteMany())
    )

    !true && describe("validateStringField", () => {
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

    !true && describe("Register", () => {
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

    !true && describe('authenticate user', () => {
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

    })

    !true && describe('update password', () => {
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
                .then(({ message }) => expect(message).to.equal(`invalid password`))

        })
        it('should fail on trying to update password with an empty password', () => {
            return logic.updatePassword(email, '', newPassword)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal(`invalid password`))

        })
        it('should fail on trying to update password with a blank password', () => {
            return logic.updatePassword(email, '     ', newPassword)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal(`invalid password`))

        })
        it('should fail on trying to update password with an undefined new password', () => {
            return logic.updatePassword(email, password, undefined)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal(`invalid newPassword`))

        })
        it('should fail on trying to update password with an empty new password', () => {
            return logic.updatePassword(email, password, '')
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal(`invalid newPassword`))

        })
        it('should fail on trying to update password with a blank new password', () => {
            return logic.updatePassword(email, password, '     ')
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal(`invalid newPassword`))

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
                .then(({ message }) => expect(message).to.equal(`invalid email`))

        })
        it('should fail on trying to unregister user with an empty email', () => {
            return logic.unregister('', password)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal(`invalid email`))

        })
        it('should fail on trying to unregister user with a numeric email', () => {
            return logic.unregister(123, password)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal(`invalid email`))

        })
        it('should fail on trying to unregister user with a blank email', () => {
            return logic.unregister('     ', password)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal(`invalid email`))

        })
    })

    !true && describe('Add review', () => {
        const book = "La chica del tren", vote = 5, comment = "Impresionante thriller"
        beforeEach(() => User.create({ email, name, password }))

        it('should succeed on add review', () => {
            return logic.addReview(email, book, vote, comment)
                .then(res => {
                    expect(res).to.be.true

                    return User.findOne({ email })
                })
                .then(user => {
                    return Review.find({ user: user.id })
                })
                .then(reviews => {
                    expect(reviews.length).to.equal(1)

                    const [review] = reviews

                    expect(review.book).to.equal(book)
                    expect(review.vote).to.equal(vote)
                    expect(review.comment).to.equal(comment)
                })
        })

        it('should fail on trying to add review with an undefined email', () => {
            return logic.addReview(undefined, book, vote, comment)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal(`invalid email`))
        })
        it('should fail on trying to add review with an empty email', () => {
            return logic.addReview('', book, vote, comment)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal(`invalid email`))
        })
        it('should fail on trying to add review with a numeric email', () => {
            return logic.addReview(123, book, vote, comment)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal(`invalid email`))
        })
        it('should fail on trying to add review with a blank email', () => {
            return logic.addReview('    ', book, vote, comment)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal(`invalid email`))
        })
        it('should fail on trying to add review with an undefined book ', () => {
            return logic.addReview(email, undefined, vote, comment)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal(`invalid book`))
        })
        it('should fail on trying to add review with an empty book ', () => {
            return logic.addReview(email, '', vote, comment)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal(`invalid book`))
        })
        it('should fail on trying to add review with a numeric book ', () => {
            return logic.addReview(email, 123, vote, comment)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal(`invalid book`))
        })
        it('should fail on trying to add review with a blank book ', () => {
            return logic.addReview(email, '      ', vote, comment)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal(`invalid book`))
        })
        it('should fail on trying to add review with an undefined vote ', () => {
            return logic.addReview(email, book, undefined, comment)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal(`invalid vote`))
        })
        it('should fail on trying to add review with an empty vote ', () => {
            return logic.addReview(email, book, '', comment)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal(`invalid vote`))
        })
        it('should fail on trying to add review with a blank vote ', () => {
            return logic.addReview(email, book, '    ', comment)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal(`invalid vote`))
        })
        it('should fail on trying to add review with an undefined comment ', () => {
            return logic.addReview(email, book, vote, undefined)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal(`invalid comment`))
        })
        it('should fail on trying to add review with an empty comment ', () => {
            return logic.addReview(email, book, vote, '')
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal(`invalid comment`))
        })
        it('should fail on trying to add review with a numeric comment', () => {
            return logic.addReview(email, book, vote, 123)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal(`invalid comment`))
        })
    })

    !true && describe('List review', () => {
        let userId
        const reviews = [
            { book: "Cien años de soledad", vote: 5, comment: "Un clásico que te lleva a los mas profundo del realismo mágico " },
            { book: "Harry Potter", vote: 4, comment: "un mundo nuevo de fantasia" },
            { book: "La casa de Bernarda Alba", vote: 5, comment: "Lorca nunca defrauda" }
        ]

        beforeEach(() => {
            return User.create({ email, name, password })
                .then(user => {
                    userId = user._id.toString()

                    return Promise.all(reviews.map(review => Review.create({ user: userId, ...review })))
                })
        })

        it('should list all user reviews', () => {
            return logic.listReviews(userId)
                .then(userReviews => {
                    expect(userReviews.length).to.equal(reviews.length)
                })
        })

    })

    !true && describe('Delete Review', () => {
        let userId, reviewId
        const reviews = [
            { book: "Cien años de soledad", vote: 5, comment: "Un clásico que te lleva a los mas profundo del realismo mágico " },
            { book: "Harry Potter", vote: 4, comment: "un mundo nuevo de fantasia" },
            { book: "La casa de Bernarda Alba", vote: 5, comment: "Lorca nunca defrauda" }
        ]

        beforeEach(() => {
            return User.create({ email, name, password })
                .then(user => {
                    userId = user._id.toString()

                    return Promise.all(reviews.map(review => Review.create({ user: userId, ...review })))
                })
                .then(review => {
                    reviewId = review[0].id

                })
        })



        it('should delete reviews correctly', () => {
            return logic.deleteReviews(reviewId, userId)
                .then(res => {
                    expect(res).to.be.true

                    return Review.find({ reviewId, userId })
                })
                .then(userReviews => {
                    //expect(userReviews.length).to.equal(0)
                    expect(userReviews).to.be.empty;
                })
        })





    })

    !true && describe('search books', () => {
        it('should search books by title', () => {
            let query = "harry potter"
            return logic.searchBook(query)
                .then(books => {

                    expect(books).to.exist
                    expect(books.length).to.equal(20)
                    expect(books[0].title).to.equal("La irresistible ascensión de Harry Potter")
                    expect(books[1].title).to.equal('Harry Potter y la Orden del Fénix')
                    expect(books[2].title).to.equal('Harry Potter y la cámara secreta')
                    expect(books[3].title).to.equal("Bautizando a harry potter")
                    expect(books[4].title).to.equal("Harry Potter y la piedra filosofal")
                    expect(books[0].authors[0]).to.equal("Andrew Blake")


                })
        })
        it('should search books by author', () => {
            let query = "j.k. Rowling"
            return logic.searchBook(query, 'author')
                .then(books => {
                    expect(books).to.exist
                    expect(books.length).to.equal(20)

                    books.forEach(book => {

                        let isAuthor = book.authors.includes('J. K. Rowling') || book.authors.includes('J.K. Rowling')
                        expect(isAuthor).to.be.true
                    })

                })
        })
        it('should search books by newest', () => {
            let query = "j.k. Rowling"
            return logic.searchBook(query, 'author', 'newest')
                .then(books => {

                    expect(books).to.exist
                    expect(books.length).to.equal(20)

                    books.forEach(book => {

                        let isAuthor = book.authors.includes('J. K. Rowling') || book.authors.includes('J.K. Rowling') || book.authors.includes("Joanne K. Rowling")
                        expect(isAuthor).to.be.true
                    })

                    expect(books[0].title).to.equal("Vivir Bien La Vida")
                    expect(books[0].publishedDate).to.equal("2018-04-30")
                    expect(books[3].publishedDate).to.equal("2018-03-01")

                })
        })

        it('should fail on trying to search books with an undefined query', () => {
            return logic.searchBook(undefined)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal(`invalid query`))

        })
        it('should fail on trying to search books with an empty query', () => {
            return logic.searchBook('')
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal(`invalid query`))

        })
        it('should fail on trying to search books with a blank query', () => {
            return logic.searchBook('    ')
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal(`invalid query`))

        })
        it('should fail on trying to search books with a numeric query', () => {
            return logic.searchBook(123)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal(`invalid query`))

        })
        // it('should fail on trying to search books with an undefined searchby', () => {
        //     let query = "harry potter"
        //     return logic.searchBook(query, undefined)
        //         .catch(err => err)
        //         .then(({ message }) => expect(message).to.equal(`undefined`))

        // })



    })
    !true && describe('add favorites', () => {
        beforeEach(() => User.create({ email, name, password }))

        it('should succeed on add favorites', () => {
            let book = "Harry Potter"
            return logic.addFavorites(email, book)
                .then(res => {
                    expect(res).to.be.true

                    return User.findOne({ email })
                })
                .then(user => {

                    expect(user.favorites).to.contain(book)
                })

        })
        it('should fail on trying to add favorites with an undefined book', () => {

            return logic.addFavorites(email, undefined)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal(`invalid book`))

        })
        it('should fail on trying to add favorites with an empty book', () => {

            return logic.addFavorites(email, '')
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal(`invalid book`))

        })
        it('should fail on trying to add favorites with a blank book', () => {

            return logic.addFavorites(email, '       ')
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal(`invalid book`))

        })
        it('should fail on trying to add favorites with a numeric book', () => {

            return logic.addFavorites(email, 123)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal(`invalid book`))

        })
        it('should fail on trying to add favorites with an undefined email ', () => {
            let book = "Harry Potter"
            return logic.addFavorites(undefined, book)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal(`invalid email`))

        })
        it('should fail on trying to add favorites with a numeric email', () => {
            let book = "Harry Potter"
            return logic.addFavorites(123, book)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal(`invalid email`))

        })
        it('should fail on trying to add favorites with an empty email', () => {
            let book = "Harry Potter"
            return logic.addFavorites('', book)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal(`invalid email`))

        })
        it('should fail on trying to add favorites with a blank email', () => {
            let book = "Harry Potter"
            return logic.addFavorites('      ', book)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal(`invalid email`))

        })

    })
    true && describe('list favorites', () => {
        let userId

        const favorites = ["15447712lpy", "78529t71pj8", "78529t71pj7"]

        beforeEach(() => {
            return User.create({ email, name, password })
                .then(user => {
                    userId = user._id.toString()

                    favorites.map(favorite => user.favorites.push())
                })
        })

        it('should list all user reviews', () => {
            debugger
            return logic.listFavorites(userId)
                .then(userFavorites => {
                    expect(userFavorites.length).to.equal(favorites.length)
                })
        })
    })

    // todo delete favorite

    true && describe('delete favorites', () => {
        let userId

        const favorites = [
            { book: "Cien años de soledad" },
            { book: "Harry Potter" },
            { book: "La casa de Bernarda Alba" }
        ]
        beforeEach(() => {
            return User.create({ email, name, password })
                .then(user => {
                    userId = user._id.toString()

                    return Promise.all(favorites.map(favorite => User.favorites.create({ user: userId, ...favorite })))
                })
        })
        it('should delete favorites correctly', () => {
            return logic.deleteFavorites(userId, bookId)
                .then(res => {
                    expect(res).to.be.true

                    return User.favorites.find({ userId, bookId })
                })
                .then(userfavorites => {

                    expect(userFavorites).to.be.empty;
                })
        })

    })

    describe('upload photo', () => {
        it('should succeed on correct upload photo', () => {

            return User.create({ email })
                .then(({ id }) => {

                    return new Promise((resolve, reject) => {

                        return fs.readFile('./demos/img_base64.txt', 'utf8', (err, buffer) => {
                            if (err) return reject(err)

                            resolve(buffer.toString())
                        })
                    }).then(imgBase64 => {
                        return logic.saveImageProfile(id, imgBase64)
                            .then(res => {
                                expect(typeof res).to.equal("string")
                            })
                    })
                })

        })

        //todo upload photo

        //todo delete photo

        afterEach(() => Promise.all([User.deleteMany(), Review.deleteMany()]))

        after(() =>
            Promise.all([
                User.deleteMany(),
                Review.deleteMany(),

            ])
                .then(() => _connection.disconnect())
        )
    })