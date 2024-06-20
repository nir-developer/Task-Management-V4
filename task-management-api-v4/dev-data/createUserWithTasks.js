const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/userModel');
const Task = require('../models/taskModel');
const dotenv = require('dotenv');
// Load environment variables
// dotenv.config({ path: './.env' });
dotenv.config({path:'./config.env'})
console.log(process.env.DB_COMPASS)

async function createUsersWithTasks() {
    await mongoose.connect(process.env.DB_COMPASS);

    console.log('Connected to MongoDB');

    const users = [
        {
            name: 'John Doe',
            email: 'john@example.com',
            password: 'userpassword123',
            tasks: [
                { title: 'John\'s First Task', description: 'This is John\'s first task description', completed: false },
                { title: 'John\'s Second Task', description: 'This is John\'s second task description', completed: false },
                { title: 'John\'s Third Task', description: 'This is John\'s third task description', completed: true },
            ]
        },
        {
            name: 'Jane Smith',
            email: 'jane@example.com',
            password: 'userpassword123',
            tasks: [
                { title: 'Jane\'s First Task', description: 'This is Jane\'s first task description', completed: false },
                { title: 'Jane\'s Second Task', description: 'This is Jane\'s second task description', completed: true },
                { title: 'Jane\'s Third Task', description: 'This is Jane\'s third task description', completed: false },
                { title: 'Jane\'s Fourth Task', description: 'This is Jane\'s fourth task description', completed: true },
            ]
        },
        {
            name: 'Alice Johnson',
            email: 'alice@example.com',
            password: 'userpassword123',
            tasks: [
                { title: 'Alice\'s First Task', description: 'This is Alice\'s first task description', completed: false },
                { title: 'Alice\'s Second Task', description: 'This is Alice\'s second task description', completed: false },
                { title: 'Alice\'s Third Task', description: 'This is Alice\'s third task description', completed: true },
                { title: 'Alice\'s Fourth Task', description: 'This is Alice\'s fourth task description', completed: false },
                { title: 'Alice\'s Fifth Task', description: 'This is Alice\'s fifth task description', completed: true },
            ]
        }
    ];

    for (const userData of users) {
        const hashedPassword = await bcrypt.hash(userData.password, 12);

        const user = new User({
            name: userData.name,
            email: userData.email,
            password: hashedPassword,
            passwordConfirm: hashedPassword,
            photo: 'default.jpg'
        });

        await user.save();
        console.log('User created:', user);

        const tasks = userData.tasks.map(task => ({
            ...task,
            user: user._id
        }));

        await Task.insertMany(tasks);
        console.log(`Tasks created for ${user.name}:`, tasks);
    }

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
}

createUsersWithTasks().catch(err => {
    console.error('Error creating users and tasks:', err);
    mongoose.disconnect();
});



// async function createUserWithTasks() {
//     await mongoose.connect(process.env.DB_COMPASS);

//     console.log('Connected to MongoDB');

//     const password = 'userpassword123';
//     const hashedPassword = await bcrypt.hash(password, 12);

//     const user = new User({
//         name: 'John Doe',
//         email: 'john@example.com',
//         password: hashedPassword,
//         passwordConfirm: hashedPassword,
//         photo: 'default.jpg'
//     });

//     await user.save();
//     console.log('User created:', user);

//     const tasks = [
//         {
//             title: 'First Task',
//             description: 'This is the first task description',
//             completed: false,
//             user: user._id
//         },
//         {
//             title: 'Second Task',
//             description: 'This is the second task description',
//             completed: false,
//             user: user._id
//         }
//     ];

//     await Task.insertMany(tasks);
//     console.log('Tasks created:', tasks);

//     await mongoose.disconnect();
//     console.log('Disconnected from MongoDB');
// }

// createUserWithTasks().catch(err => {
//     console.error('Error creating user and tasks:', err);
//     mongoose.disconnect();
// });


