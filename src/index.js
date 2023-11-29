const express = require("express");
const dotenv = require('dotenv');
const mongoose = require("mongoose");
const routes = require('./routes')
const cors = require('cors');
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')

dotenv.config()

const app = express()
const port = process.env.PORT || 3001

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true })); // Thêm extended: true để bảo đảm tương thích với body-parser
app.use(cookieParser());

routes(app);

mongoose.connect(`mongodb+srv://vuduong31022:${process.env.MONGO_DB}@cluster0.lspmxph.mongodb.net/?retryWrites=true&w=majority`)
    .then(() => {
        console.log('Connect DB success')
    })
    .catch((err) => {
        console.log(err)
    })

app.listen(port, () => {
    console.log('Server is running on port:', port);
});
