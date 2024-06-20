
const express = require('express')

const {signup, login,uploadUserPhoto} = require('../controllers/authController')

const router = express.Router(); 


router.post('/signup', uploadUserPhoto, signup);

router.post('/login', login);


module.exports = router; 


