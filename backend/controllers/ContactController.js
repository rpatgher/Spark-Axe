import { Op } from 'sequelize';
import jwt from "jsonwebtoken";

// ************* Models *************
import { Contact, Customer, Website } from '../models/index.js';


// This is made by the customer from the users website
const createContact = async (req, res) => {
    const { website } = req;
    const { name, lastname, email, phone, message } = req.body;
    if(!name || !lastname || !email || !message){
        const error = new Error('Missing fields');
        return res.status(400).json({ msg: error.message });
    }
    if(!website){
        const error = new Error('Website not found');
        return res.status(404).json({ msg: error.message });
    }
    let customer;
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        try {
            token = req.headers.authorization.split(' ')[1];
            if(token && token !== 'null'){
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                customer = await Customer.scope('withoutPassword').findByPk(decoded.id);
            } else {
                customer = await Customer.scope('withoutPassword').findOne({ where: { email } });
            }
        } catch (error) {
            console.error(error);
            return res.status(404).json({msg: 'An error occurred'});
        }
    }
    try {   
        const newContact = await Contact.create({
            name: customer?.name || name,
            lastname: customer?.lastname || lastname,
            email: customer?.email || email,
            phone: customer?.phone || phone || null,
            message,
            customer_id: customer?.id || null,
            website_id: website.id
        });
        if(!newContact){
            const error = new Error('An error ocurred');
            return res.status(400).json({ msg: error.message });
        }
        return res.json({ msg: 'Contact created succesfully' });
    } catch (error) {
        console.log(error);
        return res.status(400).json({ msg: 'An error ocurred' });
    }
}


// This is made by the user from the admin panel (SparkAxe)
const getContacts = async (req, res) => {
    const { website_id } = req.params;
    if(!website_id){
        const error = new Error('Missing fields');
        return res.status(400).json({ msg: error.message });
    }
    try {
        const website = await Website.findByPk(website_id);
        if(!website){
            const error = new Error('Website not found');
            return res.status(404).json({ msg: error.message });
        }
        if(website.user_id.toString() !== req.user.id.toString()){
            const error = new Error('Unauthorized');
            return res.status(401).json({ msg: error.message });
        }
        const contacts = await Contact.findAll({ where: { website_id } });
        return res.json(contacts);
    } catch (error) {
        console.log(error);
        return res.status(400).json({ msg: 'An error ocurred' });
    }
}

const deleteContacts = async (req, res) => {
    
    const contacts = await Contact.findAll({
        where: {
            id: {
                [Op.in]: req.body.ids
            }
        }
    });
    // Check if the contacts belong to the user and website
    const website = await Website.findOne({
        where: {
            [Op.and]: [
                { id:
                    { [Op.in]: contacts.map(contact => contact.website_id) }
                },
                { user_id: req.user.id }
            ]
        }
    });
    if(!website){
        return res.status(401).json({ msg: 'Unauthorized' });
    }
    const deletedContacts = await Promise.all(contacts.map(async contact => {
        try {
            return await contact.destroy();
        } catch (error) {
            return error;
        }
    }));
    if(deletedContacts.some(contact => contact instanceof Error)){
        if(deletedContacts.some(contact => contact?.original?.code === 'ER_ROW_IS_REFERENCED_2')){
            const currentContacts = deletedContacts.filter(contact => !(contact instanceof Error));
            return res.status(400).json({ msg: 'Cannot delete this contact', contacts: currentContacts });
        } else {
            return res.status(500).json({ msg: 'Internal Server Error' });
        }
    } else {
        return res.json({ msg: 'Contacts deleted successfully' });
    }
}


const updateCompleted = async (req, res) => {
    const { status } = req.body;
    const { website_id, contact_id } = req.params;
    if(!status || !website_id || !contact_id){
        return res.status(400).json({ msg: 'Missing fields' });
    }
    if(status !== 'C' && status !== 'NC'){
        return res.status(400).json({ msg: 'Invalid status value' });
    }
    try {
        const website = await Website.findByPk(website_id);
        if(!website){
            return res.status(404).json({ msg: 'Website not found' });
        }
        if(website.user_id.toString() !== req.user.id.toString()){
            return res.status(401).json({ msg: 'Unauthorized' });
        }
        const contact = await Contact.findByPk(contact_id);
        if(!contact){
            return res.status(404).json({ msg: 'Contact not found' });
        }
        contact.completed = status === 'C' ? true : false;
        await contact.save();
        return res.status(200).json({ msg: 'Contact updated successfully' });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ msg: 'An error ocurred' });
    }
}




export {
    createContact,
    getContacts,
    deleteContacts,
    updateCompleted
}