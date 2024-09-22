import { Op } from 'sequelize';

// ************* Helpers *************
import generateToken from '../helpers/generateToken.js';
import generateJWT from '../helpers/generateJWT.js';


// ************* Models *************
import {  Customer, Website, Order } from '../models/index.js';

const login = async (req, res) => {
    const { email, password } = req.body;
    const customer = await Customer.findOne({ 
        where: { email }
    });
    if(!customer){
        const error = new Error('Customer not found');
        return res.status(404).json({ msg: error.message });
    }
    if(!customer.confirmed){
        const error = new Error('Customer is not confirmed');
        return res.status(401).json({ msg: error.message });
    }
    if(!customer.comparePassword(password)){
        const error = new Error('Invalid password');
        return res.status(401).json({ msg: error.message });
    } else {
        return res.json({
            msg: 'Logged in successfully',
            id: customer.id,
            name: customer.name,
            lastname: customer.lastname,
            email: customer.email,
            phone: customer.phone,
            token: generateJWT(customer.id)
        });
    }
}

const createCustomer = async (req, res) => {
    const { website } = req;
    if(!website){
        const error = new Error('Website not found');
        return res.status(404).json({ msg: error.message });
    }
    const { name, lastname, email, phone, password } = req.body;
    if(!name || !lastname || !email || !phone || !password){
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
    try {
        const numCustomer = await Customer.count({ 
            where: { website_id: website.id }
        });
        const customer = Customer.build(req.body);
        customer.website_id = website.id;
        customer.index = numCustomer + 1;
        customer.confirmed = false;
        customer.token = generateToken();
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


// TODO: check if this function is necessary or if it can be deleted (maybe it is not used)
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
        if(error?.original?.code === 'ER_ROW_IS_REFERENCED_2'){
            return res.status(400).json({ msg: 'Cannot delete this customer' });
        }
        return res.status(400).json({ msg: 'An error ocurred' });
    }
}

const deleteCustomers = async (req, res) => {
    const customers = await Customer.findAll({
        where: {
            id: {
                [Op.in]: req.body.ids
            }
        }
    });
    // Check if all customers belong to the same website
    const website = await Website.findOne({
        where: {
            [Op.and]: [
                { id: 
                    { [Op.in]: customers.map(customer => customer.website_id) }
                    },
                { user_id: req.user.id }
            ]
        }
    });
    if(!website){
        const error = new Error('Website not found');
        return res.status(404).json({ msg: error.message });
    }
    const deletedCustomers = await Promise.all(customers.map(async customer => {
        const website = await Website.findByPk(customer.website_id);
        if(website.user_id.toString() !== req.user.id.toString()){
            const error = new Error('Unauthorized');
            return res.status(401).json({ msg: error.message });
        }
        try {
            const deletedCustomer = await customer.destroy();
            return deletedCustomer;
        } catch (error) {
            return error;
        }
    }));
    if(deletedCustomers.some(customer => customer instanceof Error)){
        if(deletedCustomers.some(customer => customer.original.code === 'ER_ROW_IS_REFERENCED_2')){
            const currentCustomers = deletedCustomers.filter(customer => !(customer instanceof Error));
            return res.status(400).json({ msg: 'Cannot delete some customers', customers: currentCustomers });
        }
        return res.status(400).json({ msg: 'An error ocurred' });
    } else {
        return res.json({ msg: 'Customers deleted successfully' });
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
    login,
    getCustomers,
    getCustomer,
    deleteCustomer,
    deleteCustomers,
    updateCustomer
};