import { exit } from 'node:process';
import db from '../config/db.js';
import users from './users.js';
import User from '../models/User.js';

const insertData = async () => {
    try {
        await db.authenticate();
        // Generate Collections
        await db.sync();

        // Insert Data
        await User.bulkCreate(users);
        console.log('Data inserted...');
        exit();
    } catch (error) {
        console.log('Error: ' + error);
        exit(1);
    }
}

const deleteData = async () => {
    try {
        // await User.destroy({where: {}, truncate: true})

        await db.sync({force: true});
        
        console.log('Data deleted...');
        exit();
    } catch (error) {
        console.log(error);
        exit(1);
    }
}

if(process.argv[2] === "-i"){
    insertData();
}

if(process.argv[2] === "-e"){
    deleteData();
}