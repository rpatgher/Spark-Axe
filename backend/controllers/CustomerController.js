import { Op } from 'sequelize';

// ************* Helpers *************
import generateToken from '../helpers/generateToken.js';
import generateJWT from '../helpers/generateJWT.js';


// ************* Models *************
import {  Customer, Website, Order } from '../models/index.js';

const login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ msg: 'Missing fields' });
    }
    try {
        const customer = await Customer.findOne({ 
            where: { email },
        });
        if(customer.website_id !== req.website.id){
            return res.status(401).json({ msg: 'User not allowed' });
        }
        if(!customer){
            return res.status(404).json({ msg: 'User not found' });
        }
        if(!customer.confirmed){
            return res.status(401).json({ msg: 'User is not confirmed' });
        }
        if(!customer.comparePassword(password)){
            return res.status(401).json({ msg: 'Invalid password' });
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
    } catch (error) {
        console.log(error);
        return res.status(400).json({ msg: 'An error ocurred' });
    }
}

const register = async (req, res) => {
    const { website } = req;
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
        const error = new Error('User already exists');
        return res.status(400).json({ msg: error.message });
    }
    try {
        const numCustomer = await Customer.count({ 
            where: { website_id: website.id }
        });
        const customer = Customer.build({
            name,
            lastname,
            email,
            phone,
            password
        });
        customer.website_id = website.id;
        customer.index = numCustomer + 1;
        customer.confirmed = false;
        customer.confirmationToken = generateToken();
        await customer.save();
        // TODO: Change mail template for one that fits the website
        sendEmail({
            name: `${customer.name} ${customer.lastname}`,
            email: customer.email,
            url: `${website.url_address}/confirm-account/${customer.confirmationToken}`,
            subject: 'Confirm your account',
            file: 'confirm-account'
        });
        return res.status(201).json({ msg: 'User created successfully' });
    } catch (error) {
        console.log(error);
        return res.status(400).json({ msg: 'An error ocurred' });
    }
};

const confirmAccount = async (req, res) => {
    const { token } = req.body;
    try {
        const customer = await Customer.findOne({
            where: {
                confirmationToken: token
            }
        });
        if(!customer){
            return res.status(404).json({ msg: 'Invalid token' });
        }
        if(customer.website_id !== req.website.id){
            return res.status(401).json({ msg: 'User not allowed' });
        }
        customer.confirmed = true;
        customer.confirmationToken = null;
        await customer.save();
        return res.json({ msg: 'Account confirmed' });
    } catch (error) {
        console.log(error);
        return res.status(400).json({ msg: 'An error ocurred' });
    }
}

const forgotPassword = async (req, res) => {
    const { email } = req.body;
    if(!email){
        return res.status(400).json({ msg: 'Missing fields' });
    }
    try {
        const customer = await Customer.findOne({
            where: { email }
        });
        if(!customer){
            return res.status(404).json({ msg: 'User not found' });
        }
        if(customer.website_id !== req.website.id){
            return res.status(401).json({ msg: 'User not allowed' });
        }
        const token = generateToken();
        customer.resetPasswordToken = token;
        await customer.save();
        // TODO: Change mail template for one that fits the website
        sendEmail({
            name: `${customer.name} ${customer.lastname}`,
            email: customer.email,
            url: `${req.website.url_address}/reset-password/${token}`,
            subject: 'Reset your password',
            file: 'reset-password'
        });
        return res.json({ msg: 'Email sent' });
    } catch (error) {
        console.log(error);
        return res.status(400).json({ msg: 'An error ocurred' });
    }
}

const resetPassword = async (req, res) => {
    const { token, password } = req.body;
    if(!token || !password){
        return res.status(400).json({ msg: 'Missing fields' });
    }
    try {
        const customer = await Customer.findOne({ where: { resetPasswordToken: token }});
        if(!customer){
            return res.status(404).json({ msg: 'Invalid token' });
        }
        if(customer.website_id !== req.website.id){
            return res.status(401).json({ msg: 'User not allowed' });
        }
        customer.password = password;
        customer.resetPasswordToken = null;
        await customer.save();
        return res.json({ msg: 'Password updated' });
    } catch (error) {
        console.log(error);
        return res.status(400).json({ msg: 'An error ocurred' });
    }
}

const profile = async (req, res) => {
    const { customer } = req;
    if(customer.website_id !== req.website.id){
        return res.status(401).json({ msg: 'User not allowed' });
    }
    return res.json({
        id: customer.id,
        name: customer.name,
        lastname: customer.lastname,
        email: customer.email,
        phone: customer.phone
    });
}

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
    register,
    login,
    confirmAccount,
    forgotPassword,
    resetPassword,
    profile,
    getCustomers,
    getCustomer,
    deleteCustomer,
    deleteCustomers,
    updateCustomer
};