const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({
    name:{
        type:String, 
        required:[true, 'Please provide your name']
    },
    //ADD THE EMAIL VALIDATOR PACKAGE
    email: {
        type: String, 
        required:[true, 'Please provide your email'],
        unique:true, 
        lowercase: true
    },
    password:{
        type:String, 
        required:[true, 'Please provide a password'], 
        minlength:4, 
        select:false
    }, 
    passwordConfirm:{
        type:String, 
        required:[true, 'Please confirm your password'], 
        validate:{
            validator: function(el){
                return el === this.password
            }
        }
    }, 
    photo:{
        type:String, 
        default:'default.jpg'
    }, 
    role:{
        type:String, 
        enum:['user', 'admin'],
        default:'user'

    }


})

//PRE SAVE M.W - ENCRYPT PASSWORD BEFORE SAVING 
userSchema.pre('save', async function(next){
    //If password is not new and not changed  - return
    if(!this.isModified('password')) return next(); 

    //PASSWORD UPDATED (OR NEW USER) -> ENCRYPT
    this.password = await bcrypt.hash(this.password, 12)

    //NOTE: THIS M.W WILL RUNS RIGHT BEFORE SAVING  - AFTER THE INSTANCE METHOD BELOW FOR COMPARING PASSWORD WITH PASSWORD CONFIRM !
    // =>   DONT STORE THE PASSWORD CONFIRM IN THE DB- ID DID IT'S JOB ALREADY IN THE VALIDATOR
    this.passwordConfirm = undefined; 

    next(); 
})


//INSTANCE METHOD (WILL RUN BEFORE THE PRE-SAVE ABOVE ->)
userSchema.methods.correctPassword = async function(candidatePassword, userPassword){
    return await bcrypt.compare(candidatePassword, userPassword)
}


const User = mongoose.model('User', userSchema)


module.exports = User 