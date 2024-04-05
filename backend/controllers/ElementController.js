// ************* Models *************
import { Element, Website, ElementCategory, Category, Subcategory } from '../models/index.js';

const getElement = async (req, res) => {
    const element = await Element.findOne({
        where: {
            id: req.params.id
        }
    });
    const categories = await Category.findAll({
        include: {
            model: Subcategory,
            inlcude: {
                model: Element,
                where: {
                    id: element.id
                }
            }
        }
    });
    if(!element){
        const error = new Error('Element not found');
        return res.status(404).json({ msg: error.message });
    }
    const website = await Website.findByPk(element.website_id);
    if(website.user_id.toString() !== req.user.id.toString()){
        const error = new Error('Unauthorized');
        return res.status(401).json({ msg: error.message });
    }
    res.json({element, categories});
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
    const { categories_id } = req.body;
    const subcategories = JSON.parse(categories_id);
    // return res.status(200).json({ msg: 'ok'});
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
    if(req.files.image2){
        element.image_hover = req.files.image2[0].filename;
    }
    try {
        const createdElement = await element.save();
        const elementCategory = subcategories.map(category => {
            return {
                elementId: createdElement.id,
                subcategoryId: category
            }
        });
        await ElementCategory.bulkCreate(elementCategory);
        res.json({ msg: 'Element created successfully' });
    } catch (error) {
        console.log(error);
        res.status(400).json({ msg: error.message });
    }
}

export {
    createElement,
    getElements,
    getElement
};