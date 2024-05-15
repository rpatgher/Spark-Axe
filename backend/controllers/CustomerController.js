import { Op } from 'sequelize';

// ************* Models *************
import {  Customer, Website } from '../models/index.js';

const createCustomer = async (req, res) => {
    const { name, lastname, email, phone, password, website_id } = req.body;
    if(!name || !lastname || !email || !phone || !password || !website_id){
        const error = new Error('Missing fields');
        return res.status(400).json({ msg: error.message });
    }
    const customerExists = await Customer.findOne({
        where: {
            [Op.or]: [
                { email },
                { phone }
            ]
        }
    });
    if(customerExists){
        const error = new Error('Customer already exists');
        return res.status(400).json({ msg: error.message });
    }
    const website = await Website.findByPk(website_id);
    if(!website){
        const error = new Error('Website not found');
        return res.status(404).json({ msg: error.message });
    }
    try {
        const customer = Customer.build(req.body);
        customer.confirmed = false;
        // TODO: Generate Token
        await customer.save();
        // TODO: Send confirmation email
        res.json({ msg: 'Registered succesfully' });
    } catch (error) {
        console.log(error);
        return res.status(400).json({ msg: 'An error ocurred' });
    }
};

const getCustomers = async (req, res) => {  
    const { website_id } = req.params;
    try {
        const website = await Website.findByPk(website_id);
        if(!website){
            const error = new Error('Website not found');
            return res.status(404).json({ msg: error.message });
        }
        if(website.user_id !== req.user.id){
            const error = new Error('Unauthorized');
            return res.status(401).json({ msg: error.message });
        }
        const customers = await Customer.scope('withoutPassword').findAll({ where: { website_id } });
        res.json(customers);
    } catch (error) {
        console.log(error);
        return res.status(400).json({ msg: 'An error ocurred' });
    }
}

const getCustomer = async (req, res) => {
    res.json({ msg: 'Get Customer' });
}

const deleteCustomer = async (req, res) => {
    res.json({ msg: 'Delete Customer' });
}

const deleteCustomers = async (req, res) => {
    res.json({ msg: 'Delete Customers' });
}

const updateCustomer = async (req, res) => {
    res.json({ msg: 'Update Customer' });
}

export {
    createCustomer,
    getCustomers,
    getCustomer,
    deleteCustomer,
    deleteCustomers,
    updateCustomer
};