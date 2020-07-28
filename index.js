const express = require('express');
const app = express();
const dotenv = require('dotenv');
const mongoose = require('mongoose');

const authRoute = require('./routes/auth');
const postRoute = require('./routes/posts');

dotenv.config();

const url = 'mongodb://localhost:27017/userList'

mongoose.connect(url,{ useNewUrlParser: true, useUnifiedTopology: true },()=>console.log('DB connection success'))

app.use(express.json());
app.use('/api/user', authRoute);
app.use('/posts', postRoute);

app.listen(3001, ()=>console.log("Server up and running"))