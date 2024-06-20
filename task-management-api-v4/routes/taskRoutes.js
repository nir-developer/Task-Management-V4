const authController = require('../controllers/authController')
const taskController = require('../controllers/taskController')


const express = require('express')

const router = express.Router(); 


router.route('/').post(authController.protect, taskController.createTask )
// router.route('/').post(taskController.createTask )
router.route('/').get(authController.protect, taskController.getAllTasks)


//I MUST CHECK FIRST IF THE PROVIDED TASK BELONGS TO THE CURRENT LOGIN USER!?!?
router.route('/:id')
    .get(authController.protect, taskController.getTask)
    .patch(authController.protect, taskController.updateTask)
    .delete(authController.protect, taskController.deleteTask)

module.exports = router;



