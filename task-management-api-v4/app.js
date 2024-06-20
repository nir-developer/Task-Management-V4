
const userRouter = require('./routes/userRoutes')
const taskRouter = require('./routes/taskRoutes')

const express = require('express');
const multer = require('multer');
const bodyParser = require('body-parser');
const path = require('path');

const cookieParser = require('cookie-parser')

const bcrypt = require('bcryptjs');
const cors = require('cors');

const app = express();
const port = 3000;

//NOTE! WHEN I SPECIFIY IN THE CLIENT REQUEST THE ATTRIBUTE: 
//credentials:'include' - THEN WHEN CONFIGURING CORS ON THE SERVER I MUST SPECIFY THE credentials:true
app.use(cors({
    origin:'http://localhost:1234',
    credentials:true
}))

// Middleware to parse JSON bodies(CHECK IF NEED THE URL ENCODED PARSER)
app.use(bodyParser.json());
app.use(cookieParser());
//app.use(bodyParser.urlencoded({ extended: true }));

//STATIC FILES for serving user photos
app.use('/public/images', express.static(path.join(__dirname)))
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


//END POINTS
app.use('/api/v1/users', userRouter)
app.use('/api/v1/tasks', taskRouter )

module.exports = app;
