import { exit } from 'node:process';
import db from '../config/db.js';
import users from './users.js';
import websites from './websites.js';
import features from './features.js';
import { User, Website, Inventory, Feature, WebsiteFeature } from '../models/index.js';

const insertData = async () => {
    try {
        await db.authenticate();
        // Generate Collections
        await db.sync();

        // Insert Features
        await Feature.bulkCreate(features);

        // Insert Data
        await Promise.all(users.map(async (user, i) => {
            const savedUser = await User.create(user);
            const website = Website.build(websites[i]);
            website.user_id = savedUser.id;
            await website.save();
            const inventory = Inventory.build();
            inventory.website_id = website.id;
            await inventory.save();
            const websiteFeatures = websites[i].features.map(featureId => {
                return {
                    websiteId: website.id,
                    featureId
                }
            });
            await WebsiteFeature.bulkCreate(websiteFeatures);
        }));
        console.log('Data inserted...');
        exit();
    } catch (error) {
        console.log('Error: ' + error);
        exit(1);
    }
}

const deleteData = async () => {
    try {
        await db.authenticate();
        await db.drop();
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