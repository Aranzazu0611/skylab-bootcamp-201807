'user strict'

require('dotenv').config()

const { logic } = require('.')
const { expect } = require('chai')
const mongoose = require('mongoose')
const { User, Review } = require('../data/models/index')

const { env: { MONGO_URL } } = process

describe('Logic', () => {

    const email = `Ara-${Math.random()}@mail.com`, name = `Ara-${Math.random()}`, password = `123-${Math.random()}`, photo = 'https://res.cloudinary.com/wallbook/image/upload/v1538148702/fmztcpijy2rraukwvxbg.jpg'
    let _connection
    let count = 0
    let userId

    before(() =>
        mongoose.connect(MONGO_URL, { useNewUrlParser: true })
            .then(conn => _connection = conn)
            .then(() => User.deleteMany())
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
                    return logic.register(email, name, password, photo)
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
            return User.create({ email, name, password, photo })
                .then(() => logic.register(email, name, password))
                .catch(err => err)

        })

        it('should fail on trying to register with an undefined email', () => {
            return logic.register(undefined, name, password, photo)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal(`invalid email`))

        })
        it('should fail on trying to register with a blank email', () => {
            return logic.register('   ', name, password, photo)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal(`invalid email`))

        })
        it('should fail on trying to register with an empty email', () => {
            return logic.register('', name, password, photo)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal(`invalid email`))

        })
        it('should fail on trying to register with a numeric email', () => {
            return logic.register(123, name, password, photo)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal(`invalid email`))

        })
        it('should fail on trying to register with an undefined name', () => {
            return logic.register(email, undefined, password, photo)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal(`invalid name`))

        })
        it('should fail on trying to register with a blank name', () => {
            return logic.register(email, '      ', password, photo)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal(`invalid name`))

        })
        it('should fail on trying to register with an empty name', () => {
            return logic.register(email, '', password, photo)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal(`invalid name`))

        })
        it('should fail on trying to register with an undefined password', () => {
            return logic.register(email, name, undefined, photo)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal(`invalid password`))

        })
        it('should fail on trying to register with an empty password', () => {
            return logic.register(email, name, '', photo)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal(`invalid password`))

        })
        it('should fail on trying to register with a blank password', () => {
            return logic.register(email, name, '       ', photo)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal(`invalid password`))

        })
        it('should fail on trying to register with an undefined photo', () => {
            return logic.register(email, name, password, undefined)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal(`invalid photo`))

        })
        it('should fail on trying to register with an empty photo', () => {
            return logic.register(email, name, password, '')
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal(`invalid photo`))

        })

    })

    true && describe('authenticate user', () => {
        let userId

        beforeEach(() =>
            User.create({ email, name, password, photo })
                .then(() => User.findOne({ email }))
                .then(user => userId = user.id)
        )

        it('should login correctly', () => {
            return logic.authenticate(email, password)
                .then(user => expect(user).to.equal(userId))
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

    true && describe('update password', () => {
        const newPassword = `${password}-${Math.random()}`

        beforeEach(() => User.create({ email, name, password }).then(user => userId = user.id))

        it('should update password correctly', () => {
            return logic.updatePassword(userId, password, newPassword)
                .then(res => {
                    expect(res).to.be.true

                    return User.findOne({ email })
                })
                .then(user => {
                    expect(user).to.exist
                    expect(user.id).to.equal(userId)
                    expect(user.password).to.equal(newPassword)
                })


        })

        it('should fail on trying to update password with an undefined userId', () => {
            return logic.updatePassword(undefined, password, newPassword)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal(`invalid userId`))

        })
        it('should fail on trying to update password with an empty userId', () => {
            return logic.updatePassword('', password, newPassword)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal(`invalid userId`))

        })
        it('should fail on trying to update password with a blank userId', () => {
            return logic.updatePassword('     ', password, newPassword)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal(`invalid userId`))

        })
        it('should fail on trying to update password with a numeric userId', () => {
            return logic.updatePassword(123, password, newPassword)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal(`invalid userId`))

        })
        it('should fail on trying to update password with an undefined password', () => {
            return logic.updatePassword(userId, undefined, newPassword)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal(`invalid password`))

        })
        it('should fail on trying to update password with an empty password', () => {
            return logic.updatePassword(userId, '', newPassword)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal(`invalid password`))

        })
        it('should fail on trying to update password with a blank password', () => {
            return logic.updatePassword(userId, '     ', newPassword)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal(`invalid password`))

        })
        it('should fail on trying to update password with an undefined new password', () => {
            return logic.updatePassword(userId, password, undefined)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal(`invalid newPassword`))

        })
        it('should fail on trying to update password with an empty new password', () => {
            return logic.updatePassword(userId, password, '')
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal(`invalid newPassword`))

        })
        it('should fail on trying to update password with a blank new password', () => {
            return logic.updatePassword(userId, password, '     ')
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal(`invalid newPassword`))

        })
    })

    true && describe('unregister', () => {
        beforeEach(() => User.create({ email, name, password, photo }).then(user => userId = user.id))

        it('should unregister user correctly', () => {
            return logic.unregister(userId, password)
                .then(res => {
                    expect(res).to.be.true

                    return User.findById(userId)
                })
                .then(user => {
                    expect(user).to.not.exist
                })
        })

        it('should fail on trying to unregister user with an undefined userId', () => {
            return logic.unregister(undefined, password)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal(`invalid userId`))

        })
        it('should fail on trying to unregister user with an empty userId', () => {
            return logic.unregister('', password)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal(`invalid userId`))

        })
        it('should fail on trying to unregister user with a numeric userId', () => {
            return logic.unregister(123, password)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal(`invalid userId`))

        })
        it('should fail on trying to unregister user with a blank userId', () => {
            return logic.unregister('     ', password)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal(`invalid userId`))

        })
    })

    true && describe('Add review', () => {
        let userId
        const book = "La chica del tren", title = "la chica", vote = 5, comment = "Impresionante thriller"

        beforeEach(() =>
            User.create({ email, name, password, photo })
                .then(() => User.findOne({ email }))
                .then(user => userId = user.id)
        )

        it('should succeed on add review', () => {
            return logic.addReview(userId, book, title, vote, comment)
                .then(res => {
                    expect(res).to.be.true

                    return User.findById(userId)
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

        it('should fail on trying to add review with an undefined userId', () => {
            return logic.addReview(undefined, book, title, vote, comment)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal(`invalid userId`))
        })
        it('should fail on trying to add review with an empty userId', () => {
            return logic.addReview('', book, title, vote, comment)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal(`invalid userId`))
        })
        it('should fail on trying to add review with a numeric userId', () => {
            return logic.addReview(123, book, title, vote, comment)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal(`invalid userId`))
        })
        it('should fail on trying to add review with a blank userId', () => {
            return logic.addReview('    ', book, title, vote, comment)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal(`invalid userId`))
        })
        it('should fail on trying to add review with an undefined book ', () => {
            return logic.addReview(userId, undefined, title, vote, comment)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal(`invalid book`))
        })
        it('should fail on trying to add review with an empty book ', () => {
            return logic.addReview(userId, '', title, vote, comment)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal(`invalid book`))
        })
        it('should fail on trying to add review with a numeric book ', () => {
            return logic.addReview(userId, 123, title, vote, comment)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal(`invalid book`))
        })
        it('should fail on trying to add review with a blank book ', () => {
            return logic.addReview(userId, '      ', title, vote, comment)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal(`invalid book`))
        })
        it('should fail on trying to add review with an undefined vote ', () => {
            return logic.addReview(userId, book, title, undefined, comment)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal(`invalid vote`))
        })
        it('should fail on trying to add review with an empty vote ', () => {
            return logic.addReview(userId, book, title, '', comment)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal(`invalid vote`))
        })

        it('should fail on trying to add review with an undefined comment ', () => {
            return logic.addReview(userId, book, title, vote, undefined)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal(`invalid comment`))
        })
        it('should fail on trying to add review with an empty comment ', () => {
            return logic.addReview(userId, book, title, vote, '')
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal(`invalid comment`))
        })
        it('should fail on trying to add review with a numeric comment', () => {
            return logic.addReview(userId, book, title, vote, 123)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal(`invalid comment`))
        })
    })

    true && describe('list reviews', () => {
        let userId
        const reviews = [
            { book: "TRUdyfwdaSoC", vote: 5, title: 'super', comment: "Un clásico que te lleva a los mas profundo del realismo mágico " },
            { book: "fGKyeZgvV4MC", vote: 4, title: 'genial', comment: "un mundo nuevo de fantasia" },
            { book: "4v8QCgAAQBAJ", title: 'me ha gustado mucho', vote: 5, comment: "Lorca nunca defrauda" }
        ]

        beforeEach(() => {
            return User.create({ email, name, password, photo })
                .then(user => {
                    userId = user._id.toString()

                    return Promise.all(reviews.map(review => Review.create({ user: userId, ...review })))
                })
        })

        it('should list all user reviews', () => {
            return logic.listReviews(userId)
                .then(userReviews => {
                    expect(userReviews.length).to.equal(reviews.length)

                    userReviews.forEach(review => {
                        expect(review.vote).to.be.a('number')
                        expect(review.title).to.be.a('string')
                        expect(review.bookTitle).to.be.a('string')
                    })
                })
        })

    })

    true && describe('Delete Review', () => {
        let userId, reviewId
        const reviews = [
            { book: "Cien años de soledad", vote: 5, comment: "Un clásico que te lleva a los mas profundo del realismo mágico " },
            { book: "Harry Potter", vote: 4, comment: "un mundo nuevo de fantasia" },
            { book: "La casa de Bernarda Alba", vote: 5, comment: "Lorca nunca defrauda" }
        ]

        beforeEach(() => {
            return User.create({ email, name, password, photo })
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

                    expect(userReviews).to.be.empty;
                })
        })





    })

    true && describe('search books', () => {
        let userId

        beforeEach(() =>
            User.create({ email, name, password, photo })
                .then(() => User.findOne({ email }))
                .then(user => userId = user.id)
        )

        it('should search books by title', () => {
            let query = "harry potter"
            return logic.searchBook(userId, query)
                .then(books => {

                    expect(books).to.exist
                    expect(books.length).to.equal(20)
                    expect(books[0].title).to.equal("La irresistible ascensión de Harry Potter")

                    const isCorrect = true
                    books.forEach(book => {
                        if (book.title.search(/harry potter/gi) === -1) {
                            isCorrect = false
                            return
                        }
                    })

                    expect(isCorrect).to.be.true
                    expect(books[0].authors[0]).to.equal("Andrew Blake")

                })
        })

        it('should search books by author', () => {
            let query = "j.k. Rowling"
            return logic.searchBook(userId, query, 'author')
                .then(books => {
                    expect(books).to.exist
                    expect(books.length).to.equal(20)

                    books.forEach(book => {
                        let isAuthor = book.authors.some(author => author.match(/Rowling/gi))
                        expect(isAuthor).to.be.true
                    })

                })
        })

        it('should search books by newest', () => {
            let query = "j.k. Rowling"
            return logic.searchBook(userId, query, 'author', 'newest')
                .then(books => {

                    expect(books).to.exist
                
                    books.forEach(book => {

                        let isAuthor = book.authors.includes('J. K. Rowling') || book.authors.includes('J.K. Rowling') || book.authors.includes("Joanne K. Rowling")
                        expect(isAuthor).to.be.true
                    })

                    expect(books[0].title).to.equal("Vivir Bien La Vida")
                    expect(books[0].publishedDate).to.equal("2018-04-30")

                })
        })

        it('should fail on trying to search books with an undefined userId', () => {
            let query = "harry potter"
            return logic.searchBook(undefined, query)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal(`invalid userId`))

        })

        it('should fail on trying to search books with an empty userId', () => {
            let query = "harry potter"
            return logic.searchBook('', query)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal(`invalid userId`))

        })

        it('should fail on trying to search books with an empty userId', () => {
            let query = "harry potter"
            return logic.searchBook('     ', query)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal(`invalid userId`))

        })

        it('should fail on trying to search books with an undefined query', () => {
            let userId = "485522"
            return logic.searchBook(userId, undefined)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal(`invalid query`))

        })
        it('should fail on trying to search books with an empty query', () => {
            return logic.searchBook(userId, '')
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal(`invalid query`))

        })
        it('should fail on trying to search books with a blank query', () => {
            return logic.searchBook(userId, '    ')
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal(`invalid query`))

        })
        it('should fail on trying to search books with a numeric query', () => {
            return logic.searchBook(userId, 123)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal(`invalid query`))

        })




    })

    true && describe('add favorite', () => {
        let userId
        beforeEach(() =>
            User.create({ email, name, password, photo })
                .then(() => User.findOne({ email }))
                .then(user => userId = user.id)
        )

        it('should succeed on add favorites', () => {
            let bookId = "9KJJYFIss_wC"
            return logic.addFavorite(userId, bookId)
                .then(res => {
                    expect(res).to.be.true

                    return User.findById(userId)
                })
                .then(user => {
                    expect(user.favorites).to.contain(bookId)
                })

        })

        it('should fail on trying to add favorites with an undefined book id', () => {

            return logic.addFavorite(userId, undefined)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal(`invalid bookId`))

        })
        it('should fail on trying to add favorites with an empty book id', () => {

            return logic.addFavorite(userId, '')
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal(`invalid bookId`))

        })
        it('should fail on trying to add favorites with a blank book id', () => {

            return logic.addFavorite(userId, '       ')
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal(`invalid bookId`))

        })
        it('should fail on trying to add favorites with a numeric book id', () => {
            return logic.addFavorite(userId, 123)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal(`invalid bookId`))

        })
        it('should fail on trying to add favorites with an undefined userId ', () => {
            let bookId = "9KJJYFIss_wC"
            return logic.addFavorite(undefined, bookId)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal(`invalid userId`))

        })
        it('should fail on trying to add favorites with a numeric userId', () => {
            let bookId = "9KJJYFIss_wC"
            return logic.addFavorite(123, bookId)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal(`invalid userId`))

        })
        it('should fail on trying to add favorites with an empty userId', () => {
            let bookId = "9KJJYFIss_wC"
            return logic.addFavorite('', bookId)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal(`invalid userId`))

        })
        it('should fail on trying to add favorites with a blank userId', () => {
            let bookId = "9KJJYFIss_wC"
            return logic.addFavorite('      ', bookId)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal(`invalid userId`))

        })

    })

    true && describe('list favorites', () => {
        let userId

        const favorites = ["9788441416291", "9781781101353", "9781781101322"]

        beforeEach(() => {
            return User.create({ email, name, password, photo })
                .then(user => {
                    userId = user._id.toString()

                    user.favorites.push(...favorites)

                    return user.save()
                })
        })

        it('should list all user reviews', () => {
            return logic.listFavorites(userId)
                .then(userFavorites => {
                    expect(userFavorites.length).to.equal(favorites.length)

                })
        })
    })



    true && describe('delete favorite', () => {
        let userId

        const favorites = ["9KJJYFIss_wC", "s1gVAAAAYAAJ"]

        const bookId = '9KJJYFIss_wC'

        beforeEach(() => {
            return User.create({ email, name, password, favorites })
                .then(user => {
                    userId = user._id.toString()
                })
        })

        it('should delete favorites correctly', () => {
            return logic.deleteFavorite(userId, bookId)
                .then(res => {
                    expect(res).to.be.true

                    return User.findById(userId)
                })
                .then(user => {
                    expect(user.favorites.length).to.equal(1);
                    expect(user.favorites.includes(bookId)).to.be.false
                })
        })

    })

    true && describe('retrieve book by its id', () => {
        const bookId = '9KJJYFIss_wC'
        let userId

        beforeEach(() =>
            User.create({ email, name, password, photo })
                .then(() => User.findOne({ email }))
                .then(user => userId = user.id)
        )

        it('should succeed on correct book id', () =>
            logic.retrieveBook(bookId, userId)
                .then(book => {
                    expect(book).to.exist
                    expect(book.volumeInfo.title).to.equal('Professional Javascript For Web Developers, 2nd Ed')
                })
        )
    })




    afterEach(() => Promise.all([User.deleteMany(), Review.deleteMany()]))

    after(() =>
        Promise.all([
            User.deleteMany(),
            Review.deleteMany(),

        ])
            .then(() => _connection.disconnect())
    )
})