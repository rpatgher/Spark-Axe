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
    const { id } = req.params;
    try {
        const customer = await Customer.findByPk(id);
        if(!customer){
            const error = new Error('Customer not found');
            return res.status(404).json({ msg: error.message });
        }
        const website = await Website.findByPk(customer.website_id);
        if(!website){
            const error = new Error('Website not found');
            return res.status(404).json({ msg: error.message });
        }
        if(website.user_id !== req.user.id){
            const error = new Error('Unauthorized');
            return res.status(401).json({ msg: error.message });
        }
        await customer.destroy();
        res.json({ msg: 'Customer deleted successfully' });
    } catch (error) {
        console.log(error);
        return res.status(400).json({ msg: 'An error ocurred' });
    }
}

const deleteCustomers = async (req, res) => {
    try{
        const customers = await Customer.findAll({
            where: {
                id: {
                    [Op.in]: req.body.ids
                }
            }
        });
        customers.forEach(async customer => {
            const website = await Website.findByPk(customer.website_id);
            if(website.user_id !== req.user.id){
                const error = new Error('Unauthorized');
                return res.status(401).json({ msg: error.message });
            }
            await customer.destroy();
        });
        res.json({ msg: 'Customers deleted successfully' });
    } catch (error) {
        console.log(error);
        return res.status(400).json({ msg: 'An error ocurred' });
    }
}

const updateCustomer = async (req, res) => {
    const { id } = req.params;
    const { name, lastname, email, phone } = req.body;
    if(!name || !lastname || !email || !phone){
        const error = new Error('Missing fields');
        return res.status(400).json({ msg: error.message });
    }
    try {
        const customer = await Customer.findByPk(id);
        if(!customer){
            const error = new Error('Customer not found');
            return res.status(404).json({ msg: error.message });
        }
        const website = await Website.findByPk(customer.website_id);
        if(!website){
            const error = new Error('Website not found');
            return res.status(404).json({ msg: error.message });
        }
        if(website.user_id !== req.user.id){
            const error = new Error('Unauthorized');
            return res.status(401).json({ msg: error.message });
        }
        customer.name = name;
        customer.lastname = lastname;
        customer.email = email;
        customer.phone = phone;
        await customer.save();
        res.json({ msg: 'Customer updated successfully' });
    } catch (error) {
        console.log(error);
        return res.status(400).json({ msg: 'An error ocurred' });
    }
}

export {
    createCustomer,
    getCustomers,
    getCustomer,
    deleteCustomer,
    deleteCustomers,
    updateCustomer
};