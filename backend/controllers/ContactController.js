import { Op } from 'sequelize';

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
    try {
        const newContact = await Contact.create({
            name: req?.customer?.name || name,
            lastname: req?.customer?.lastname || lastname,
            email: req?.customer?.email || email,
            phone: req?.customer?.phone || phone || null,
            message,
            customer_id: req?.customer?.id || null,
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
    try {
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
            return res.status(401).json({ message: 'Unauthorized' });
        }
        await Promise.all(contacts.map(async contact => {
            await contact.destroy();
        }));
        return res.json({ message: 'Contacts deleted successfully' });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Internal Server Error' });
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