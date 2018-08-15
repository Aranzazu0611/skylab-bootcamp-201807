
const axios = require('axios')

const logic = {

    username: "",
    

    register(username, password) {
        return axios.post('http://localhost:8080/register', { username, password })
            .then((res) => res.data.message)   
            .catch(error => { throw Error(error.response.data.message)})         
    },      
               
        
        
   

    login(username, password) {

        return axios.post('http://localhost:8080/authenticate', { username, password })
       
        .then((res) => {
                      
                this.username = username
                return true
                       
        })
        .catch(error => { throw Error(error.response.data.message)})

    },
    


    downloadFile(username,file){
        return axios.get('http://localhost:8080/user/${username}/files/${file}')
        .then((res) => res.data.message) 
        .catch(error => { throw Error(error.response.data.message)}) 

    },

    deleteFile(username,file){
        return axios.delete('http://localhost:8080/user/${this.username}/files/${files}')
        .then((res) => res.data.message) 
        .catch(error => { throw Error(error.response.data.message)})

    },


    uploadFile(username,file){

        return axios.post('http://localhost:8080/user/${this.username}/files/', file, {headers:
    
        form.getHeaders()}
        
        .then((res) => res.data.message) 
        .catch(error => { throw Error(error.response.data.message)})
    
        )}


    




















}

if (typeof module !== 'undefined') module.exports = logic;