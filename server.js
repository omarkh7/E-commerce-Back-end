const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
require('dotenv').config();
const connectDB = require('./config/db');

const PORT = process.env.PORT || 3000; 

// To parse URL encoded data
app.use(bodyParser.urlencoded({ extended: false }));
// To parse json data
app.use(bodyParser.json());
app.use(cors());
app.use(morgan('common'));
// app.use(Router);
app.use(express.json());



app.listen(PORT, () => {
    connectDB();
    console.log(`Server is running on port : ${PORT}`);
});
