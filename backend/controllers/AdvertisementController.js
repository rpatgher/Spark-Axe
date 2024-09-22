import { Op } from 'sequelize';
import fs from 'fs';


// ************* Models *************
import { Advertisement, Section, Website } from '../models/index.js';


const createAdvertisement = async (req, res) => {
    const { title, published, website_id, section_id } = req.body;
    if([title, published, website_id, section_id].includes('')){
        return res.status(400).json({ message: 'All fields are required' });
    }
    if(!req.file || Object.keys(req.file).length === 0){
        const error = new Error('Image is required');
        return res.status(400).json({ message: error.message });
    }
    const website = await Website.findByPk(website_id);
    if(!website){
        return res.status(404).json({ message: 'Website not found' });
    }
    if(website.user_id.toString() !== req.user.id.toString()){
        return res.status(401).json({ message: 'Unauthorized' });
    }
    const advertisement = Advertisement.build({
        title,
        image: req.file.filename,
        published,
        section_id
    });
    try {
        await advertisement.save();
        return res.json({ msg: 'Advertisement created successfully' });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}

const editAdvertisement = async (req, res) => {
    const { id } = req.params;
    const { title, published, website_id, section_id } = req.body;
    if([title, published, website_id, section_id].includes('')){
        return res.status(400).json({ message: 'All fields are required' });
    }
    const advertisementFromDB = await Advertisement.findByPk(id);
    if(!advertisementFromDB){
        // Delete the current image from the server
        if(req.file){
            fs.unlinkSync(`./public/uploads/advertisements/${req.file.filename}`);
        }
        const error = new Error('Advertisement not found');
        return res.status(404).json({ message: error.message });
    }
    // console.log(req.file);
    // return res.status(400).json({ message: 'Test' });
    const website = await Website.findByPk(website_id);
    if(!website){
        // Delete the current image from the server
        if(req.file){
            fs.unlinkSync(`public/uploads/advertisements/${req.file.filename}`);
        }
        return res.status(404).json({ message: 'Website not found' });
    }
    if(website.user_id.toString() !== req.user.id.toString()){
        // Delete the current image from the server
        if(req.file){
            fs.unlinkSync(`public/uploads/advertisements/${req.file.filename}`);
        }
        return res.status(401).json({ message: 'Unauthorized' });
    }
    // Delete old image from the server
    if(req.file){
        fs.unlinkSync(`./public/uploads/advertisements/${advertisementFromDB.image}`);
    }
    const advertisement = req.body;
    if(req.file){
        advertisement.image = req.file.filename;
    } else {
        advertisement.image = advertisementFromDB.image;
    }
    try {
        await Advertisement.update(advertisement, { where: { id } });
        return res.json({ msg: 'Advertisement edited successfully' });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}

const getAdvertisements = async (req, res) => {
    const { website_id } = req.params;
    const website = await Website.findByPk(website_id, {
        attributes: ['id', 'name', 'user_id']
    });
    if(!website){
        return res.status(404).json({ message: 'Website not found' });
    }
    if(website.user_id.toString() !== req.user.id.toString()){
        return res.status(401).json({ message: 'Unauthorized' });
    }
    const advertisements = await Advertisement.findAll({
        attributes: ['id', 'title', 'image', 'published', 'section_id'],
        include: {
            model: Section,
            as: 'section',
            attributes: ['name'],
            include: {
                model: Website,
                as: 'website',
                attributes: ['name']
            }
        },
        where: {
            '$section.website_id$': website_id
        }
    });
    return res.json(advertisements);
}

const getAdvertisement = async (req, res) => {
    const { id } = req.params;
    const advertisement = await Advertisement.findByPk(id, {
        attributes: ['id', 'title', 'image', 'published', 'section_id'],
        include: {
            model: Section,
            as: 'section',
            attributes: ['id', 'name'],
            include: {
                model: Website,
                as: 'website',
                attributes: ['id', 'name', 'user_id']
            }
        }
    });
    if(!advertisement){
        return res.status(404).json({ message: 'Advertisement not found' });
    }
    if(advertisement.section.website.user_id.toString() !== req.user.id.toString()){
        return res.status(401).json({ message: 'Unauthorized' });
    }
    return res.json({
        id: advertisement.id,
        title: advertisement.title,
        image: advertisement.image,
        published: advertisement.published,
        section_id: advertisement.section_id
    });
}

const deleteAdvertisement = async (req, res) => {
    const { id } = req.params;
    const advertisement = await Advertisement.findByPk(id, {
        attributes: ['id', 'title', 'image', 'published', 'section_id'],
        include: {
            model: Section,
            as: 'section',
            attributes: ['id', 'name'],
            include: {
                model: Website,
                as: 'website',
                attributes: ['id', 'name', 'user_id']
            }
        }
    });
    if(!advertisement){
        return res.status(404).json({ message: 'Advertisement not found' });
    }
    if(advertisement.section.website.user_id.toString() !== req.user.id.toString()){
        return res.status(401).json({ message: 'Unauthorized' });
    }
    try {
        await Advertisement.destroy({ where: { id } });
        if(advertisement.image){
            fs.unlinkSync(`./public/uploads/advertisements/${advertisement.image}`);
        }
        return res.json({ msg: 'Advertisement deleted successfully' });
    } catch (error) {
        console.log(error);
        if(error?.original?.code === 'ER_ROW_IS_REFERENCED_2'){
            return res.status(400).json({ msg: 'Cannot delete this advertisement' });
        }
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}

const deleteAdvertisements = async (req, res) => {
    const advertisements = await Advertisement.findAll({
        where: {
            id: {
                [Op.in]: req.body.ids
            }
        },
        include: {
            model: Section,
            as: 'section',
            attributes: ['website_id'],
        },
        attributes: ['id', 'image'],
    });
    // Check if all advertisements belong to the same website
    const website = await Website.findOne({
        where: {
            [Op.and]: [
                { id: 
                    { [Op.in]: advertisements.map(advertisement => advertisement.section.website_id) }
                },
                { user_id: req.user.id }
            ]
        }
    });
    if(!website){
        return res.status(401).json({ message: 'Unauthorized' });
    }
    const deletedAdvertisements = await Promise.all(advertisements.map(async advertisement => {
        try {
            const deletedAdvertisement = await advertisement.destroy();
            if(advertisement.image){
                fs.unlinkSync(`./public/uploads/advertisements/${advertisement.image}`);
            }
            return deletedAdvertisement;
        } catch (error) {
            return error;
        }
    }));
    if(deletedAdvertisements.some(advertisement => advertisement instanceof Error)){
        if(deletedAdvertisements.some(advertisemente => advertisemente.origin.code === 'ER_ROW_IS_REFERENCED_2')){
            const currentAdvertisements = deletedAdvertisements.filter(advertisement => !(advertisement instanceof Error));
            return res.status(400).json({ message: 'Cannot delete some advertisements', advertisements: currentAdvertisements });
        }
        return res.status(500).json({ message: 'Internal Server Error' });
    } else{
        return res.json({ msg: 'Advertisements deleted successfully' });
    }
}


export {
    createAdvertisement,
    getAdvertisements,
    editAdvertisement,
    getAdvertisement,
    deleteAdvertisement,
    deleteAdvertisements
}