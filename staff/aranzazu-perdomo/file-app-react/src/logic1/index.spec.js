'use strict'
const logic = require('.')
const {expect} = require('chai')

describe('logic(file-app-react)', () => {
    
    
    
    describe('register', () => {
        
        const username = 'Aranzazu' + Math.random(), password = "123"
        
        it('should register on valid credentials',() =>{

           
            
            return logic.register(username, password).then(res => {
                
                
                expect(res).to.equal('user registered')
           
            })


        })

    })

    describe('login', () => {

        const username = 'Aranzazu' + Math.random(), password = "123"
       
      
        it('should login corretly',() =>{
            
           
                      
            return logic.register(username, password)
            .then( () => logic.login(username, password))
            .then(res => {               
                expect(logic.username).to.equal(username)
                expect(res).to.be.true
           
            })


        })

    })

    describe("upload file", () => {

       
        it('should upload file', () => {






        })





    })









    describe('download file', () => {

        const username = 'Aran' , password = "Aran"
        const file = "applenav.png"
      
        it('should download file',() =>{
               
          return logic.login(username,password)            
            
            .then( () => logic.downloadFile(username, file))
            .then(res => {               
                
                expect(res).to.be.true
           
            })


        })

    })

    

























})





















