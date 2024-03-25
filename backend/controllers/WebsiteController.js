// ************* Models *************
import { Website } from '../models/index.js';

const getWebsite = async (req, res) => {
    const website = await Website.findByPk(req.params.id);
    if(!website){
        const error = new Error('Website not found');
        return res.status(404).json({ msg: error.message });
    }
    if(website.user_id.toString() !== req.user.id.toString()){
        const error = new Error('Unauthorized');
        return res.status(401).json({ msg: error.message });
    }
    res.json(website);
}

const createWebsite = async (req, res) => {
    const website = Website.build(req.body);
    website.user_id = req.user.id;
    try {
        await website.save();
        res.json({ msg: 'Website created successfully' });
    } catch (error) {
        console.log(error);
        res.status(400).json({ msg: 'An error ocurred' });
    }
}

export {
    createWebsite,
    getWebsite
};