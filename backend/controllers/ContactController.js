// ************* Models *************
import { Contact, Customer } from '../models/index.js';


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
    const { website_id } = req.user;
    return res.json({ msg: 'Get contacts', website_id });
}





export {
    createContact,
    getContacts
}