const mongoose = require('mongoose');
const User = require('../models/userModel');
const Task = require('../models/taskModel');
const dotenv = require('dotenv');

// Load environment variables
// dotenv.config({ path: './.env' });
dotenv.config({path:'./config.env'})
async function deleteAllUsersAndTasks() {
  
    await mongoose.connect(process.env.DB_COMPASS);


    console.log('Connected to MongoDB');

    await User.deleteMany({});
    console.log('All users deleted');

    await Task.deleteMany({});
    console.log('All tasks deleted');

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
}

deleteAllUsersAndTasks().catch(err => {
    console.error('Error deleting users and tasks:', err);
    mongoose.disconnect();
});
