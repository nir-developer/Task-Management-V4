const Task = require('../models/taskModel')


exports.createTask = async(req,res) => {
    try 
    {
        console.log('INSIDE CREATE TASK HANDLER')
         console.log(req.user)

        const task = await Task.create({
            title: req.body.title, 
            description: req.body.description, 
            //FIRST FAKE - POSTMAN  OK- FAKE THE USER BEFORE IMPLEMENTING AUTHENTICATION
            //6671314d7a0c5a3551e12f68
           // user: req.body.user
            user:req.user._id
        })


        console.log('TASK CREATED SUCCESSFULLY')

        console.log(task)

        res.status(201).json({
            status:'success', 
            data:{
                task
            }
        })


    }
    catch(error)
    {
        res.status(500).json({
            status:'success', 
            message:error.message
        })

    }
}

//ALL TASKS FOR A GIVEN USER!!(THE USER ID SHOULD BE IN THE REQUEST - SET BY PROTECT)
exports.getAllTasks = async(req,res) => {
    try 
    {
        //GET ALL TASKS FOR THE USER ID IN THE REQUEST
        
        // const tasks = await Task.findOne({user: req.user._id})
        const tasks = await Task.find({user: req.user._id})

        console.log('getAllTasks handler- success! list of all tasks for the given user id:')
        console.log(tasks)
        
        
        res.status(200).json({
            status:'success', 
            results:tasks.length,
            data:{
                tasks
            }
        })

        

    }
    catch(error)
    {

        console.log('findAllTasks: Failed to get all users for the current user id')
        
        res.status('fail').json({
            status:'fail', 
            message:error.message
        })
        
    }
}


exports.getTask = async (req,res) =>{
    try 
    {
        //A TASK BELONG TO ONLY ONE USER! 
        const task = await Task.findById(req.params.id)
        
        if(!task) {
            return res.status(404).json({
                status:'fail', 
                message:'No task found for the provided task id: ', taskId
            })
        }
        
        res.status(200).json({
            status:'success', 
            data:{
                task
            }
        })

    }
    catch(error)
    {
        console.log('getTask handler - failed')
        res.status(500)
            .json({
                status:'success', 
                message:error.message
            })
    }
}


//UPDATE TASK 
exports.updateTask = async (req,res) => {

    try 
    {
        const task = await Task.findByIdAndUpdate(req.params.id, 
            req.body, {
                new:true, 
                runValidators: true
            }
        )

        if(!task) return res.status(404).json({
            status:'fail', 
            message:'No task found with that id'
        })

        res.status(200).json(task)


        
        res.status(200).json({
            status:'success', 
            data:{
                task:{}
            }
        })

    }
    catch(error)
    {
        console.log('UPDATE TASK HANDLER - COULD NOT UPDATE')
        res.status(500).json({
            status:'fail', 
            message:error.message
        })
    }
}


exports.deleteTask = async (req,res) => {
    try 
    {
        const task = await Task.findByIdAndDelete(req.params.id)

        if(!task) return res.status('fail').json({
            status:'fail', 
            message:'Could not delete a task with the provided id!'
        })

        console.log('DELETED TASK!')
        console.log(task)

        res.status(204).json({
            //SHOULD HAVE THIS RESPONSE BODY! in postman
            status:'success', 
            data:{
                task
            }
        })

    }
    catch(error)
    {
        res.status(500).json({
            status:'fail',
            message:error.message
        })

    }
}

