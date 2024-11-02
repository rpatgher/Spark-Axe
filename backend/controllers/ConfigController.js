import { Op } from 'sequelize';

// ************* Models *************
import {  Website, ConfigElement, Element } from '../models/index.js';


const getElementConfig = async (req, res) => {
    try {
        const website = await Website.findOne({
            where: {
                id: req.params.website_id
            }
        });
        if (!website) {
            return res.status(404).json({ msg: 'Website not found' });
        }
        if(website.user_id !== req.user.id){
            return res.status(401).json({ msg: 'Unauthorized' });
        }
        const config = await ConfigElement.findOne({
            where: {
                website_id: req.params.website_id
            }
        });
        return res.status(200).json({ config });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ msg: 'Internal server error' });
    }
}

export {
    getElementConfig
}