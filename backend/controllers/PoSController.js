import { Op } from 'sequelize';
import fs from 'fs';

// ************* Models *************
import { PoS, Website, Config, PoSProperty } from '../models/index.js';

const createPoS = async (req, res) => {
    const { name, address, city, country, postalCode, countryCode, latitude, longitude, image, email, phone, website_id, category_id } = req.body;
    if([name, address, city, country, postalCode, countryCode, latitude, longitude, image, email, phone].includes('')){
        return res.status(400).json({ msg: 'All fields are required' });
    }
    if(!req.file || Object.keys(req.file).length === 0){
        const error = new Error('Image is required');
        return res.status(400).json({ msg: error.message });
    }
    const website = await Website.findByPk(website_id);
    if(!website){
        return res.status(404).json({ msg: 'Website not found' });
    }
    if(website.user_id.toString() !== req.user.id.toString()){
        return res.status(401).json({ msg: 'Unauthorized' });
    }
    const config = await Config.findOne({
        where: {
            website_id
        },
        include: {
            model: PoSProperty,
            attributes: { exclude: ['createdAt', 'updatedAt', 'id'] },
        },
        attributes: { exclude: ['website_id', 'createdAt', 'updatedAt', 'id'] }
    });
    if(config.pos_properties.map(p => p.name).includes('category') && !category_id){
        return res.status(400).json({ msg: 'All fields are required' });
    }
    const pos = PoS.build({
        name,
        address,
        city,
        country,
        postalCode,
        countryCode,
        latitude,
        longitude,
        image: req.file.filename,
        email,
        phone,
        pos_category_id: category_id || null,
        website_id
    });
    try {
        await pos.save();
        return res.json({ msg: 'PoS created successfully' });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ msg: 'Internal Server Error' });
    }
}

const getPoS = async (req, res) => {
    const { website_id } = req.params;
    const website = await Website.findByPk(website_id, {
        attributes: ['id', 'user_id']
    });
    if(!website){
        return res.status(404).json({ msg: 'Website not found' });
    }
    if(website.user_id.toString() !== req.user.id.toString()){
        return res.status(401).json({ msg: 'Unauthorized' });
    }
    const pos = await PoS.findAll({
        where: {
            website_id
        },
        attributes: ['id', 'name', 'address', 'image', 'email', 'phone']
    });
    return res.status(200).json(pos);
}

const getPoSById = async (req, res) => {
    const { id } = req.params;
    const pos = await PoS.findByPk(id, {
        attributes: ['id', 'name', 'address', 'city', 'country', 'postalCode', 'countryCode', 'latitude', 'longitude', 'image', 'email', 'phone', 'pos_category_id', 'website_id'],
        include: {
            model: Website,
            as: 'website',
            attributes: ['id', 'name', 'user_id']
        }
    });
    if(!pos){
        return res.status(404).json({ msg: 'PoS not found' });
    }
    if(pos.website.user_id.toString() !== req.user.id.toString()){
        return res.status(401).json({ msg: 'Unauthorized' });
    }
    return res.status(200).json(pos);
}

const updatePoS = async (req, res) => {
    const { id } = req.params;
    const { name, address, city, country, postalCode, countryCode, latitude, longitude, image, email, category_id, phone, website_id } = req.body;
    if([name, address, city, country, postalCode, countryCode, latitude, longitude, email, phone].includes('')){
        return res.status(400).json({ msg: 'All fields are required' });
    }
    const posFromDB = await PoS.findByPk(id);
    if(!posFromDB){
        if(req.file){
            fs.unlinkSync(`./public/uploads/pos/${req.file.filename}`);
        }
        return res.status(404).json({ msg: 'PoS not found' });
    }
    const website = await Website.findByPk(website_id);
    if(!website){
        if(req.file){
            fs.unlinkSync(`./public/uploads/pos/${req.file.filename}`);
        }
        return res.status(404).json({ msg: 'Website not found' });
    }
    if(website.user_id.toString() !== req.user.id.toString()){
        if(req.file){
            fs.unlinkSync(`./public/uploads/pos/${req.file.filename}`);
        }
        return res.status(401).json({ msg: 'Unauthorized' });
    }
    const config = await Config.findOne({
        where: {
            website_id
        },
        include: {
            model: PoSProperty,
            attributes: { exclude: ['createdAt', 'updatedAt', 'id'] },
        },
        attributes: { exclude: ['website_id', 'createdAt', 'updatedAt', 'id'] }
    });
    if(config.pos_properties.map(p => p.name).includes('category') && !category_id){
        return res.status(400).json({ msg: 'All fields are required' });
    }
    if(req.file){
        fs.unlinkSync(`./public/uploads/pos/${posFromDB.image}`);
    }
    const pos = {...req.body, pos_category_id: category_id || null};
    if(req.file){
        pos.image = req.file.filename;
    } else {
        pos.image = posFromDB.image;
    }
    try {
        await PoS.update(pos, { where: { id } });
        return res.json({ msg: 'PoS updated successfully' });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ msg: 'Internal Server Error' });
    }
}

const deletePoS = async (req, res) => {
    const { id } = req.params;
    const pos = await PoS.findByPk(id, {
        attributes: ['id', 'website_id'],
        include: {
            model: Website,
            as: 'website',
            attributes: ['user_id']
        }
    });
    if(!pos){
        return res.status(404).json({ msg: 'PoS not found' });
    }
    if(pos.website.user_id.toString() !== req.user.id.toString()){
        return res.status(401).json({ msg: 'Unauthorized' });
    }
    try {
        await pos.destroy();
        if(pos.image){
            fs.unlinkSync(`./public/uploads/pos/${pos.image}`);
        }
        return res.json({ msg: 'PoS deleted successfully' });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ msg: 'Internal Server Error' });
    }
}

const deleteManyPoS = async (req, res) => {
    const { ids } = req.body;
    const pos = await PoS.findAll({
        where: {
            id: {
                [Op.in]: ids
            }
        },
        attributes: ['id', 'image', 'website_id'],
        include: {
            model: Website,
            as: 'website',
            attributes: ['user_id']
        }
    });
    if(!pos || pos.length === 0){
        return res.status(404).json({ msg: 'PoS not found' });
    }
    const website = await Website.findOne({
        where: {
            [Op.and]: [
                { id: 
                    {[Op.in]: pos.map(p => p.website_id)}
                },
                { user_id: req.user.id },
            ]
        }
    });
    if(!website){
        return res.status(401).json({ msg: 'Unauthorized' });
    }
    const deletedPoS = await Promise.all(pos.map(async p => {
        try {
            await p.destroy();
            if(p.image){
                fs.unlinkSync(`./public/uploads/pos/${p.image}`);
            }
        } catch (error) {
            return error;
        }
    }));
    if(deletedPoS.some(p => p instanceof Error)){
        if(deletedPoS.some(p => p?.original?.code === 'ER_ROW_IS_REFERENCED_2')){
            const currentPoS = deletedPoS.filter(p => !(p instanceof Error));
            return res.status(400).json({ msg: 'Cannot delete some PoS', pos: currentPoS });
        }
        return res.status(500).json({ msg: 'Internal Server Error' });
    } else {
        return res.json({ msg: 'PoS deleted successfully' });
    }
}

export {
    createPoS,
    getPoS,
    getPoSById,
    updatePoS,
    deletePoS,
    deleteManyPoS
}