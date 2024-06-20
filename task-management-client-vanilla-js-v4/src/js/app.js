//LATER: CHECK WITH DOMContentLoaded 

const API_BASE_URL = 'http://localhost:3000/api/v1'

//STATE (MUTABLE - LATER WITH IMMUTABLE)
const state = {
    user: null,
    tasks:[{title:'Gym', description:'BALASSS', completed:true}, {title:'XXX', description:'SFSFSF', completed:false}],
    selectedTask:{title:'GYM!!!', description:'BALASFFA ', completed:true}
    // user: {name:'Nir', photo:'http://localhost:3000/api/v1/public/images/default.jpg'}, 
   // tasks:[], 

}

//DOM  ELEMENTS SELECTIONS 
const loginForm = document.getElementById('login-form')
const signupForm = document.getElementById('signup-form')

const logoutBtn = document.getElementById('logout-btn'); 
const userNameEl = document.getElementById('user-name')
const userPhotoEl = document.getElementById('user-photo')
const taskListEl = document.getElementById('task-list')
const taskDetailEl = document.getElementById('task-detail')
const addTaskBtn = document.getElementById('add-task-btn')

const authModal = document.getElementById('auth-modal')
//////////////////////////////////////



const renderUser = () => {

    if(state.user)
    {
        userNameEl.textContent= state.user.name; 
        userPhotoEl.src = state.user.photo; 
        authModal.style.display = 'none'

    }
    else
    {
        userNameEl.textContent = ''
        //userPhotoEl.src ='../img/users/default.jpg'
        userPhotoEl.src = ''
        authModal.style.display = 'flex'

    }

}


 const renderTasks = () => {

        //CLEAR CURRENT MARKUP OF THE LIST 
        taskListEl.innerHTML = ''

        //LOOP OVER THE TASKS IN THE STATE AND CREATE LI FOR EACH TASK OBJECT(CALL RENDER TASK) - AND APPEND CHILD IT TO THE LIST 
        state.tasks.forEach(task => {
            //CREATE AN LI ELEMENT WITH THE CURRENT TASK TITLE AS IT'S CONTENT AND STYLE IT
            const taskEl = document.createElement('li')
            taskEl.textContent = task.title;
            taskEl.classList.add('main__task-item')


            //ATTACH A SUBSCRIBER ON THE CLICK EVENT THAT UPDATE THE selectedTask state , and render the selected task
            //(LATER CHECK WITH EVENT DELEGATION)
            taskEl.addEventListener('click', () => {
                //DIRECT ACCESS TO THE STATE - LATER CHANGE THIS TO IMMUTABLE!
                state.selectedTask = task; 
                renderTaskDetail();

            })

            //APPEND THE LI TO THE UL 
            taskListEl.appendChild(taskEl)

        })
    }


/**TASKS: 
 * 1. ADD CONTENT ON THE ALREADY CREATED <LI> BY THE renderTasks() above! 
 * 2. ATTACH THE SUBSCRIBER FOR THE CLICKS EVENTS  ON THE BUTTONS OF THE LI

 */
//HOISTED?!?!?!  - NOT ! SINCE IT IS CALLED ASYNCHOROONAULY!
const renderTaskDetail = () => {

    if(state.selectedTask)
    {
        taskDetailEl.innerHTML = `
                <h2>${state.selectedTask.title}</h2>
                <p>${state.selectedTask.description}</p>
                <p>${state.selectedTask.completed}</p>
                <button id="update-task-btn">Update Task</button>
                <button id="delete-task-btn">Delete Task</button>

        `

        //ATTACH E.L TO THE NEW BUTTONS 
        document.getElementById('update-task-btn').addEventListener('click', () => {
          
            console.log('UPDATE TASK CLICKED')
            //DISPLAY  A PROMPT BROWSER TO COLLECT USER DATA (THE SECOND ARG IS THE CURRENT STATE)
            const updatedTitle = prompt('Enter new title:', state.selectedTask.title)
            const updatedDescription = prompt('Enter new description', state.selectedTask.description)

            console.log('USER INPUT TO UPDATE:', updatedTitle, updatedDescription)
            
            //UPDATE THE TASK : Pass the task id and the updated inputs 
            updateTask(state.selectedTask._id, {title: updatedTitle, description: updatedDescription})





        })

         document.getElementById('delete-task-btn').addEventListener('click', () => {
            console.log('DELETE BUTTON CLICKED')
            //HTTP DELETE REQUEST TO THE API 
            //deleteTask(state.selectedTask._id); 
         })



    }


}

////////////////////////////////
//TASK MANAGEMENT FUNCTIONS - CRUD


//NOTE - HE PASSED THE 2 ARGS : title, description (CHECK LATER FOR HOW TO USE PROPS!)
const addTask = async(title, description) =>{
    try 
    {
        const response = await fetch(`${API_BASE_URL}/tasks`, {
            headers:{
                'Content-Type':'application/json'
            },
            method:'POST', 
            credentials:'include',//NOTE! MUST INCLUDE THE credentials:true on the SERVER IF I DEFINED THIS HERE ON THE CLIENT
            body: JSON.stringify({title, description})
        })

        const data = await response.json(); 

    
        //UPDATE THE TASKS IN THE STATE (LATER CHANGE TO IMMUTABLE!)
        state.tasks.push(data.data.task)

        console.log('UPDATE LIST OF TASKS AFTER ADDING NEW TASK')
        console.log(state.tasks)



    }   

    catch(error)
    {
        console.error('CLIENT CATCHED! FAILED TO CREATE TASK!', error.message)
    }

}

const updateTask = async(taskId, updates ) => {
    console.log('updateTask() - BEFORE MAKING THE AJAX PATCH ERQUEST')
}


// renderTasks();

///////////////////////////////////////////////////////////
//REGISTER HANDLERS ON  EXISTED DOM ELEMENTS ON STARTUP 
//////////////////////////////////////////////
addTaskBtn.addEventListener('click', () => {
    const title = prompt('Enter task title'); 
    const description = prompt('Enter a description')

    //CALL addTask only if user passed both title and description inputs 
    if(title && description ) addTask(title, description)
})















