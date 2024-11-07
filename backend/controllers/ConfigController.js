import { Op } from 'sequelize';

// ************* Models *************
import {  Website, Config, ElementProperty, PoSProperty } from '../models/index.js';


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
        const config = await Config.findOne({
            where: {
                website_id: req.params.website_id
            },
            include: {
                model: ElementProperty,
                attributes: { exclude: ['createdAt', 'updatedAt', 'id'] },
            },
            attributes: { exclude: ['website_id', 'createdAt', 'updatedAt', 'id'] }
        });
        const formatedConfig = new Object();
        config.element_properties.forEach(property => {
            formatedConfig[property.name] = {
                unit: property.element_config_property.unit
            }
        });
        return res.status(200).json({ config: formatedConfig });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ msg: 'Internal server error' });
    }
}

const getPoSConfig = async (req, res) => {
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
        const config = await Config.findOne({
            where: {
                website_id: req.params.website_id
            },
            include: {
                model: PoSProperty,
                attributes: { exclude: ['createdAt', 'updatedAt', 'id'] },
            },
            attributes: { exclude: ['website_id', 'createdAt', 'updatedAt', 'id'] }
        });
        const formatedConfig = new Object();
        config.pos_properties.forEach(property => {
            formatedConfig[property.name] = true;
        });
        return res.status(200).json({ config: formatedConfig });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ msg: 'Internal server error' });
    }
}

export {
    getElementConfig,
    getPoSConfig
}