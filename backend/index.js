import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';


// ********** Routes **********
import UserRouter from './routes/UserRoutes.js';
import WebsiteRouter from './routes/WebsiteRoutes.js';
import ElementRouter from './routes/ElementRoutes.js';
import CategoryRouter from './routes/CategoryRoutes.js';
import AdvertisementRouter from './routes/AdvertisementRoutes.js';
import ContactRouter from './routes/ContactRoutes.js';
import SectionRouter from './routes/SectionRoutes.js';
import OrderRouter from './routes/OrderRoutes.js';
import InventoryRouter from './routes/InventoryRoutes.js';
import CustomerRouter from './routes/CustomerRoutes.js';
import ElibabaRouter from './routes/ElibabaRoutes.js';

// Connect DB
import db from './config/db.js';
db.authenticate();
db.sync()
    .then(() => console.log('Database connected...'))
    .catch(err => console.log('Error: ' + err));

// Config ENV
dotenv.config({ path: '.env' });

// Create Express App
const app = express();
// Enable JSON 
app.use(express.json());
// Enabling static files
app.use(express.static('public'));

// Config CORS
const whiteList = process.env.FRONTEND_URLS.split(',');
const corsOptions = {
    origin: (origin, callback) => {
        if(whiteList.includes(origin)){
            callback(null, true);
        }else{
            callback(new Error('Not allowed by CORS'));
        }
    }
}
app.use(cors(corsOptions));

// Routing
app.use('/api/users', UserRouter);
app.use('/api/websites', WebsiteRouter);
app.use('/api/elements', ElementRouter);
app.use('/api/advertisements', AdvertisementRouter)
app.use('/api/contacts', ContactRouter);
app.use('/api/sections', SectionRouter);
app.use('/api/categories', CategoryRouter);
app.use('/api/orders', OrderRouter);
app.use('/api/inventories', InventoryRouter);
app.use('/api/customers', CustomerRouter);

// Routing for Elibaba
app.use('/api/elibaba', ElibabaRouter);


// Listen
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));

//conectar la base de datos y mantener la conexion