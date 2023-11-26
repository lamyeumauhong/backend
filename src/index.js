const express = require("express");
const dotenv = require("dotenv");
const routes = require ('./routes')
const { default: mongoose } = require("mongoose");
const { route } = require("express/lib/application");
const bodyParser = require("body-parser");
dotenv.config()
const app = express()
const port = process.env.PORT || 3001
app.use(bodyParser.json())
routes(app);

mongoose.connect(`mongodb+srv://vuduong31022:${process.env.MONGO_DB}@cluster0.lspmxph.mongodb.net/?retryWrites=true&w=majority`)
.then(()=>{
    console.log('Connect DB success')
    })
    .catch((err)=>{
        console.log(err)
    })

app.listen(port, () =>{
    console.log('Sever is running in port:', + port)

})
