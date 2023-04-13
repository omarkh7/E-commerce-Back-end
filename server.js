const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const app = express();
require('dotenv').config();
const connectDB = require('./config/db');
const pagesRoute = require('./routes/pagesRoute.js');
const { postPage } = require('./controllers/pagesController');
const CategoryRoute = require('./routes/categoryRoute')
const PORT = process.env.PORT || 3000; 
const orderRoute=require('./routes/orderRoute')
const userRoute = require('./routes/userRoute');
const productsRoute = require('./routes/productRoute');

// To parse URL encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: false }))

app.use(cors());

app.use(morgan('common'));
app.use(express.static('public'));  
app.use('/images', express.static('images'));

// app.use(Router);
app.use(express.json());
app.use("/pages", pagesRoute)
app.use("/pages/:id", pagesRoute)
app.use("/category", CategoryRoute)
app.use("/category/:id", CategoryRoute)
app.use('/api',orderRoute);
app.use('/api', userRoute);
app.use('/api/products', productsRoute);

app.listen(PORT, () => {
    connectDB();
    console.log(`Server is running on port : ${PORT}`);
});
