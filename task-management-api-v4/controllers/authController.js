const User = require('../models/userModel')
const jwt = require('jsonwebtoken')

//MULTER HERE IN THE CONTROLLER
const multer = require('multer')
const path  = require('path')

const signToken = id => {
    return jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN})
}


const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true
  };
 // if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;



  //TEST IN THE RESPONSE HEADER IF THERE IS A Header: Set-Cookie with the token value
  res.cookie('jwt', token, cookieOptions);


  // Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    //In the beginning I sent the toke as a simple string in the request body!
    token,
    message:'HTTPOnly Cookie Set',
    data: {
      user
    }
  });
};


//MULTER CONFIGURATION FOR PHOTO UPLOAD 
const storage = multer.diskStorage({
    destination: (req,res,cb) => {
        cb(null, 'public/images')
    },
    filename: (req,file, cb) => {
        const ext = path.extname(file.originalname);
        //LATER CHANGE TO USERNAME!
        cb(null, `user-${req.body.email}-${Data.now()}${ext}`)
    }
})

const upload = multer({storage})

//photo is the value of the 'name' attribute of the image element (type file) in the HTML 
exports.uploadUserPhoto = upload.single('photo')

exports.signup = async(req,res) => {
    try 
    {
        //CREATE NEW USER BASED ONT THE REQUEST BODY OBJECT AND FILE OBJECT IN THE REQUEST(not body!)
        let user = await User.create({
            name: req.body.name, 
            email: req.body.email, 
            password: req.body.password, 
            passwordConfirm: req.body.passwordConfirm, 
            photo: req.file ? req.file.filename : 'default.jpg'
        })

        console.log('SUCCESS SIGNUP NEW USER INTO THE DB!')
        console.log(user)

        createSendToken(user, 201, res)
       
        // res.status(201).json({
            //     status:'success', 
            //     data:{
                //         user
                //     }
                // })
    }
    catch(error){
        console.log('FAILED TO SIGNUP', error.message)
        res.status(500).json({
            status:'fail', 
            message:error.message
        })
    }
}



exports.login = async (req,res) => {
    try 
    {
        const {email, password} = req.body; 

        if(!email || !password) {
                return res.status(400).json({
                    status:'fail', 
                    message:'Please provide email and password'
                })
            }
        
            //EXPLICITLY SELECT THE PASSWORD - SINCE SET IN THE SCHEMA TO - SELECT: FALSE!
            const user = await User.findOne({email}).select('+password')
            
            if(!user || !(await user.correctPassword(password, user.password)))
                    return res.status(401).json({
                status:'fail', 
                message:'Incorrect email or password'
                
            })


            createSendToken(user, 200, res)


    }
    catch(error)
    {
        console.log('FAILED TO LOGIN', error.message)
        res.status(500).json({
            status:'fail', 
            message:error.message
        })
    }
}


//PROTECT M.W FOR PROTECTED RESOURCES - TASK MANAGEMENT
exports.protect = async(req,res,next) => {

    try 
    {
    //CHECK IF THE JWT IN THE HTTP ONLY COOKIE 
    // let token ; 
    // if(req.cookies) token = req.cookie.jwt; 

    // if(!token) return res.status(401).json({
    //     status:'fail', 
    //     message: 'You are not logged in! Please log in to get access'
    // })

    // //VERIFY THE JWT
    // const decoded = jwt.verify(token, process.env.JWT_SECRET)

    // const currentUser = await User.findById(decoded.id)

    
    // if(!currentUser){
    //     return res.status(401).json({
    //         status:'fail', 
    //         message:'The user belonging to this token does no longer exist.'
    //     })
    // }


    // //ADD THE USER INTO THE REQUEST 
    // res.user = currentUser; 

     //CONTINUE TO PROTECTED RESOURCE- NEXT() 

    const user = await User.findById('66744f50a9b96acf20d6e174');

    
    if(!user) return res.status(500).json({
        status:'fail', 
        message:'NO USER FOUND WITH THE GIVEN id'
    })
    console.log('INSIDE PROTECT - FOUND USER FOR THE FAKED ID IN THE REQUEST')
    console.log(user); 

    req.user = user
    
    next(); 
   

    }
    catch(error)
    {
        res.status(500).json({
            status:'fail', 
            message:error.message
        })

    }
    
}