// ************* Models *************
import { Element, Website } from '../models/index.js';

const getElement = async (req, res) => {
    const element = await Element.findByPk(req.params.id);
    if(!element){
        const error = new Error('Element not found');
        return res.status(404).json({ msg: error.message });
    }
    const website = await Website.findByPk(element.website_id);
    if(website.user_id.toString() !== req.user.id.toString()){
        const error = new Error('Unauthorized');
        return res.status(401).json({ msg: error.message });
    }
    res.json(element);
}

const getElements = async (req, res) => {
    const website = await Website.findByPk(req.params.id);
    if(!website){
        const error = new Error('Website not found');
        return res.status(404).json({ msg: error.message });
    }
    if(website.user_id.toString() !== req.user.id.toString()){
        const error = new Error('Unauthorized');
        return res.status(401).json({ msg: error.message });
    }
    const elements = await Element.findAll({
        where: {
            website_id: website.id
        }
    });
    res.json(elements);
}

const createElement = async (req, res) => {
    const website = await Website.findByPk(req.body.website_id);
    if(!website){
        const error = new Error('Website not found');
        return res.status(404).json({ msg: error.message });
    }
    if(website.user_id.toString() !== req.user.id.toString()){
        const error = new Error('Unauthorized');
        return res.status(401).json({ msg: error.message });
    }
    const element = Element.build(req.body);
    element.website_id = website.id;
    element.image = req.files.image[0].filename;
    element.image_hover = req.files.image2[0].filename;
    try {
        await element.save();
        res.json({ msg: 'Element created successfully' });
    } catch (error) {
        console.log(error);
        res.status(400).json({ msg: 'An error ocurred' });
    }
}

export {
    createElement,
    getElements,
    getElement
};