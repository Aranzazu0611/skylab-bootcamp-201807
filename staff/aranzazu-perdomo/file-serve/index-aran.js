const express = require('express')
const fs = require('fs')
const fileUpload = require('express-fileupload')
const package = require('./package.json')
const path = require('path');

const { argv: [, , port] } = process

const app = express()

app.use(fileUpload())

app.get('/helloworld', (req, res) => {
    res.send(`<html>
    <head>
        <title>hola mundo</title>
    </head>
    <body>
        <h1>hello world!</h1>
    </body>
</html>`)
})

app.get('/files', (req, res) => {
    const files = fs.readdirSync('files')

    res.send(`<html>
    <head>
        <title>files</title>
    </head>
    <body>
        <ul>
            ${files.map(file => `<li><a href="downloads/${file}" >${file}</a></li>`).join('')}
        </ul>

        <form action="/files" method="post" encType="multipart/form-data">
            <input type="file" name="upload">
            <button>upload</button>
        </form>
    </body>
</html>`)
})

app.post('/files', (req, res) => {
    const { files: { upload } } = req

    upload.mv(`files/${upload.name}`, function (err) {
        if (err)
            return res.status(500).send(err)

        res.redirect('/files')
    });
})
//descargar archivo
app.get('/downloads/:file', (req, res) => {
    const file = `files/${req.params.file}`
    res.download(file)
 })

 //borrar archivo
 app.get('/deleted/:file', (req,res) => {
     const fileToDeleted = `files/${req.params.file}`
     fs.unlinkSync(fileToDeleted)
     res.redirect('/files')
 })

app.listen(port, () => console.log(`${package.name} ${package.version} up and running on port ${port}`))