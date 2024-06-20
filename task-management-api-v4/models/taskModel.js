
const mongoose = require('mongoose')

const taskSchema = new mongoose.Schema({
    title:{
        type:String,
        required:[true, 'A task must have a title']
    }, 
    description:{
        type:String, 
        required:[true, 'A task  must have a description']
    },
    completed:{
        type:Boolean, 
        default:false
    },
    user:{
        type: mongoose.Schema.ObjectId, 
        ref:'User',
        required:[true, 'A task must belong to a user'],
        //FAKE THE USER BEFORE IMPLEMENTING PROTECTED ROUTES FOR TASK MANAGEMENT
       // default:'6671314d7a0c5a3551e12f68'
    },
    date:{
       type: Date, 
       default: Date.now() 
    }


})

const Task = mongoose.model('Task', taskSchema)
module.exports = Task 