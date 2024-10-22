import { Op } from 'sequelize';

// ************* Helpers *************
import generateJWT from '../helpers/generateJWT.js';
import generateToken from '../helpers/generateToken.js';
import sendEmail from '../helpers/sendEmail.js';


// ************* Models *************
import { Element, Website, Category, Subcategory, Advertisement, Section, Customer, Order, OrderElement } from '../models/index.js';


const getElements = async (req, res) => {
    const { website } = req;
    if(!website){
        const error = new Error('Website not found');
        return res.status(404).json({ msg: error.message });
    }
    let elements = await Element.findAll({
        where: {
            website_id: website.id,
            published: true
        },
        include: [
            {
                model: Subcategory,
                include: [
                    {
                        model: Category
                    }
                ]
            }
        ]
    });
    elements = elements.map(element => {
        const newElement = {
            id: element.id,
            name: element.name,
            description: element.description,
            image: element.image,
            image_hover: element.image_hover,
            price: element.price,
            stock: element.stock,
            color: element.color,
            published: element.published,
            categories: element.subcategories.map(subcategory => {
                return {
                    category: subcategory.category.name,
                    subcategory: subcategory.name,
                }
            })
        }
        let categories = newElement.categories.reduce((acc, current) => {
            if(!acc[current.category]){
                acc[current.category] = [];
            }
            acc[current.category].push(current.subcategory);
            return acc;
        }, {});
        categories = Object.entries(categories).map(([key, value]) => {
            return {
                category: key,
                subcategories: value
            }
        });
        newElement.categories = categories;
        return newElement;
    });
    const categories = await Category.findAll({
        where: {
            website_id: website.id
        },
        include: [
            {
                model: Subcategory,
                attributes: { exclude: ['id', 'category_id', 'createdAt', 'updatedAt'] }
            }
        ],
        attributes: { exclude: ['id', 'website_id','createdAt', 'updatedAt'] }
    });
    res.json({elements, categories});
}

const getOrders = async (req, res) => {
    const { customer } = req;
    const { website } = req;
    if(customer.website_id !== website.id){
        return res.status(401).json({ msg: 'User not allowed' });
    }
    try {
        const orders = await customer.getOrders({
            where: {
                customer_id: customer.id,
                status: {
                    [Op.not]: 'C'
                }
            },
            include: [
                {
                    model: Element,
                    attributes: ['id', 'name', 'price', 'image'],
                    through: {
                        attributes: ['quantity']
                    }
                }
            ]
        });
        return res.status(200).json(orders);
    } catch (error) {
        console.log(error);
        return res.status(400).json({ msg: 'An error ocurred' });
    }
}


const getInfo = async (req, res) => {
    const { website } = req;
    if(!website){
        const error = new Error('Website not found');
        return res.status(404).json({ msg: error.message });
    }
    const elements = await Element.findAll({
        where: {
            website_id: website.id,
            published: true
        },
        include: [
            {
                model: Subcategory,
                attributes: { exclude: ['category_id', 'createdAt', 'updatedAt', 'index', 'element_subcategory'] },
                include: [
                    {
                        model: Category,
                        attributes: { exclude: ['website_id', 'createdAt', 'updatedAt'] },
                        order: [
                            ['index', 'ASC']
                        ]
                    }
                ]
            }
        ],
        attributes: { exclude: ['website_id', 'createdAt', 'updatedAt'] },
        order: [
            ['index', 'ASC']
        ]
    });
    const categories = await Category.findAll({
        where: {
            website_id: website.id
        },
        include: [
            {
                model: Subcategory,
                attributes: { exclude: ['category_id', 'createdAt', 'updatedAt'] },
                order: [
                    ['index', 'ASC']
                ]
            }
        ],
        attributes: { exclude: ['website_id','createdAt', 'updatedAt'] },
        order: [
            ['index', 'ASC']
        ]
    });
    const advertisements = await Advertisement.findAll({
        include: [
            {
                model: Section,
                where: {
                    website_id: website.id
                },
                attributes: { exclude: ['website_id', 'createdAt', 'updatedAt'] }
            }
        ],
        attributes: { exclude: ['section_id', 'createdAt', 'updatedAt'] }
    });
    res.json({
        elements,
        categories,
        advertisements
    });
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



const createOrder = async (req, res) => {
    const { notes, elements, address } = req.body;
    const { website } = req;
    const { customer } = req;
    if (!elements || !address) {
        return res.status(400).json({ msg: 'All fields are required' });
    }
    if ( customer.website_id !== website.id) {
        return res.status(400).json({ msg: 'Customer not found' });
    }
    const productsFromDB = await Element.findAll({
        where: {
            id: elements.map(product => product.id),
            website_id: website.id
        },
        attributes: ['id', 'stock', 'price']
    });
    if (!productsFromDB) return res.status(400).json({ msg: 'Products not found' });
    let isValid = true;
    const products = elements.map(product => {
        const productFromDB = productsFromDB.find(p => p.id === product.id);
        if (!productFromDB) {
            isValid = false;
        }
        if (product.quantity > productFromDB?.stock) {
            isValid = false;
        }
        return {
            id: productFromDB?.id,
            quantity: product.quantity,
            price: productFromDB?.price
        }
    });
    if (!isValid) {
        return res.status(400).json({ msg: 'An error ocurred' });
    }
    const numOrders = await customer.countOrders({
        where: {
            website_id: website.id
        }
    });
    const order = await Order.create({
        index: numOrders + 1,
        status: 'IP',
        notes,
        total: products.reduce((acc, current) => acc + current.price * current.quantity, 0),
        address,
        customer_id: customer.id,
        website_id: website.id
    });
    products.forEach(async product => {
        await Element.decrement('stock', {
            by: product.quantity,
            where: {
                id: product.id
            }
        });
    });
    try{
        const createdOrder = await order.save();
        const orderElements = products.map(product => {
            return {
                orderId: createdOrder.id,
                quantity: product.quantity,
                elementId: product.id,
            }
        });
        await OrderElement.bulkCreate(orderElements);
        return res.json({ msg: 'Order created' });
    } catch (error) {
        console.log(error);
        return res.status(400).json({ msg: 'An error ocurred' });
    }
}

export {
    getElements,
    getOrders,
    getInfo,
    register,
    login,
    confirmAccount,
    profile,
    forgotPassword,
    resetPassword,
    createOrder
}