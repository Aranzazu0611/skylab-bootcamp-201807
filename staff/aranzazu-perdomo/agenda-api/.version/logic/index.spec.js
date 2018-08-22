'use strict'



require('dotenv').config()

const { logic } = require('.')
const { expect } = require('chai')
const fs = require('fs')
const emailValidator = require('../utils/validate-mail/index')
const { MongoClient } = require('mongodb')
const { MONGO_URL } = process.env


describe('logic', () =>{

    const email ="ara@gmail.com",username = "ara", password = "123"
    let _conn, _db, _users

    before(done => {
        MongoClient.connect(MONGO_URL,{ useNewUrlParser: true }, (err, conn) => {
            if (err) return done(err)

            _conn = conn

            const db = _db = conn.db()

            logic._users = _users = db.collection('users')

            done()
        })

    })

    // beforeEach(() => {
        

    //     return _users.deleteMany()
    // })

    describe('register', () => {

        it('should register on valid credentials', () =>
            _users.findOne({email})
                .then(() =>{
                    
                    return logic.register(email,username,password)

                })
                .then(() => _users.findOne({email}))
                .then(user => {
                    expect(user).to.exist
                    expect(user.email).to.equal(email)
                    expect(user.username).to.equal(username)
                    expect(user.password).to.equal(password)
                })
            )

        it('should fail on trying to register an already registered user', () =>
            _users.insertOne({ email, username, password })
                .then(() => logic.register(email, username, password))
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal(`email ${email} already exists`))
                
        
            )

        it('should fail on trying to register with an undefined email', () =>
            logic.register(undefined, username, password)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal(`invalid email`))
            )

        it('should fail on trying to register with an empty email', () =>
            logic.register('', username, password)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal('email  already exists'))
        )

        
        it('should fail on trying to register with an undefined password', () =>
        logic.register(email, undefined, password)
            .catch(err => err)
            .then(({ message }) => expect(message).to.equal(`invalid username`))
         )

         it('should fail on trying to register with an empty password', () =>
        logic.register(email,'', password)
            .catch(err => err)
            .then(({ message }) => expect(message).to.equal(`invalid username`))
         )

         it('should fail on trying to register with an empty password', () =>
        logic.register(email, 123, password)
            .catch(err => err)
            .then(({ message }) => expect(message).to.equal(`invalid username`))
         )

         it('should fail on trying to register with an undefined password', () =>
        logic.register(email, username, undefined)
            .catch(err => err)
            .then(({ message }) => expect(message).to.equal(`invalid password`))
         )

         it('should fail on trying to register with an undefined password', () =>
        logic.register(email, username, '')
            .catch(err => err)
            .then(({ message }) => expect(message).to.equal(`invalid password`))
         )
        
             
    })

    describe('authenticate', () => {
        beforeEach(() =>
            _users.insertOne({email, password })
        )

        it('should authenticate on correct credentials', () => {
            return logic.authenticate(email, password)
                .then(res => expect(res).to.be.true)
        })

        it('should fail on wrong credentials', () => {
            return logic.authenticate(email, 'grillo')
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal('wrong credentials'))
        })

        
        it('should fail on wrong email', () => {
            return logic.authenticate('pepito', password)
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal('email pepito not exists'))
        })

        it('should fail on wrong empty credentials', () => {
            return logic.authenticate('', '')
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal('invalid password'))
        })

        it('should fail on wrong empty password', () => {
            return logic.authenticate(email, '')
                .catch(err => err)
                .then(({ message }) => expect(message).to.equal('invalid password'))
        })

        

    })

    describe('add notes', () =>{

        let useremail,title,content,noteId,date,day,month,year

        beforeEach(() => {
            useremail = `ara@gmail.com`
            title = 'a' + Math.random(), content = "lorem blah blah"
            day = Math.floor(Math.random() * 31) +1
            month = Math.floor(Math.random() * 12) +1
            year = 2018
            date = day + '-' + month + '-' + year
        })

        it('should create a new note correctly', () => {
            _user.insertOne({email:useremail,password,notes:[]})
            return logic.addNote(useremail,title,content,date)
                .then(id => {
                    expect(id).to.exist
                    noteId = id
                })
        })

        it('should delete correctly', () => {
            _user.insertOne({email:useremail})
            
           
        })

    })

})