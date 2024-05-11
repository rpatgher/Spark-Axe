//These functions handle various operations related to elements in your application. They interact with your database to create, read, update, and delete elements. They also perform checks to ensure that users are authorized to perform these operations.
import fs from 'fs';
import { Op } from 'sequelize';

// ************* Models *************
import { Element, Website, ElementCategory, Category, Subcategory } from '../models/index.js';

const getElement = async (req, res) => {
    const elementFromDB = await Element.findOne({
        where: {
            id: req.params.id
        },
        include: [
            {
                model: Subcategory,
                include: [
                    {
                        model: Category
                    }
                ]
            }
        ]
    });
    if(!elementFromDB){
        const error = new Error('Element not found');
        return res.status(404).json({ msg: error.message });
    }
    const website = await Website.findByPk(elementFromDB.website_id);
    if(website.user_id.toString() !== req.user.id.toString()){
        const error = new Error('Unauthorized');
        return res.status(401).json({ msg: error.message });
    }
    const element = {
        id: elementFromDB.id,
        name: elementFromDB.name,
        description: elementFromDB.description,
        image: elementFromDB.image,
        image_hover: elementFromDB.image_hover,
        price: elementFromDB.price,
        stock: elementFromDB.stock,
        color: elementFromDB.color,
        published: elementFromDB.published,
        categories: elementFromDB.subcategories.map(subcategory => {
            return {
                category: subcategory.category.name,
                subcategory: subcategory.name,
            }
        })
    }
    let categories = element.categories.reduce((acc, current) => {
        if(!acc[current.category]){
            acc[current.category] = [];
        }
        acc[current.category].push(current.subcategory);
        return acc;
    }, {});
    categories = Object.entries(categories).map(([key, value]) => {
        return {
            category: key,
            subcategories: value
        }
    });
    element.categories = categories;
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

const updateElement = async (req, res) => {
    const { categories_id } = req.body;
    const subcategories = JSON.parse(categories_id);
    const elementFromDB = await Element.findOne({
        where: {
            id: req.params.id
        }
    });
    if(!elementFromDB){
        // Delete the current images from the server
        if(req.files.image){
            fs.unlinkSync(`public/uploads/elements/${req.files.image[0].filename}`);
        }
        if(req.files.image2){
            fs.unlinkSync(`public/uploads/elements/${req.files.image2[0].filename}`);
        }
        const error = new Error('Element not found');
        return res.status(404).json({ msg: error.message });
    }
    // Delete old images from the server
    if(req.files.image){
        fs.unlinkSync(`public/uploads/elements/${elementFromDB.image}`);
    }
    if(req.files.image2){
        fs.unlinkSync(`public/uploads/elements/${elementFromDB.image_hover}`);
    }
    const website = await Website.findByPk(elementFromDB.website_id);
    if(website.user_id.toString() !== req.user.id.toString()){
        // Delete the current images from the server
        if(req.files.image){
            fs.unlinkSync(`public/uploads/elements/${req.files.image[0].filename}`);
        }
        if(req.files.image2){
            fs.unlinkSync(`public/uploads/elements/${req.files.image2[0].filename}`);
        }
        const error = new Error('Unauthorized');
        return res.status(401).json({ msg: error.message });
    }
    const element = req.body;
    if(req.files.image){
        element.image = req.files.image[0].filename;
    }else{
        element.image = elementFromDB.image;
    }
    if(req.files.image2){
        element.image_hover = req.files.image2[0].filename;
    }else{
        element.image_hover = elementFromDB.image_hover;
    }
    try {
        await Element.update(element, {
            where: {
                id: req.params.id
            }
        });
        await ElementCategory.destroy({
            where: {
                elementId: req.params.id
            }
        });
        const elementCategory = subcategories.map(category => {
            return {
                elementId: req.params.id,
                subcategoryId: category
            }
        });
        await ElementCategory.bulkCreate(elementCategory);
        res.json({ msg: 'Element updated successfully' });
    } catch (error) {
        console.log(error);
        res.status(400).json({ msg: error.message });
    }
}

const deleteElement = async (req, res) => {
    const elementFromDB = await Element.findOne({
        where: {
            id: req.params.id
        }
    });
    if(!elementFromDB){
        const error = new Error('Element not found');
        return res.status(404).json({ msg: error.message });
    }
    const website = await Website.findByPk(elementFromDB.website_id);
    if(website.user_id.toString() !== req.user.id.toString()){
        const error = new Error('Unauthorized');
        return res.status(401).json({ msg: error.message });
    }
    try {
        await Element.destroy({
            where: {
                id: req.params.id
            }
        });
        if(elementFromDB.image){
            fs.unlinkSync(`public/uploads/elements/${elementFromDB.image}`);
        }
        if(elementFromDB.image_hover){
            fs.unlinkSync(`public/uploads/elements/${elementFromDB.image_hover}`);
        }
        res.json({ msg: 'Element deleted successfully' });
    } catch (error) {
        console.log(error);
        res.status(400).json({ msg: error.message });
    }
}

const deleteElements = async (req, res) => {
    try {
        const elements = await Element.findAll({
            where: {
                id: {
                    [Op.in]: req.body.ids
                }
            }
        });
        elements.forEach(async element => {
            await Element.destroy({
                where: {
                    id: element.id
                }
            });
            if(element.image){
                fs.unlinkSync(`public/uploads/elements/${element.image}`);
            }
            if(element.image_hover){
                fs.unlinkSync(`public/uploads/elements/${element.image_hover}`);
            }
        });
        res.json({ msg: 'Elements deleted successfully' });
    } catch (error) {
        console.log(error);
        res.status(400).json({ msg: error.message });
    }
}

const publishProduct =  async (req, res) => {
    const { id } = req.params;
    const product = await Element.findByPk(id);
    if(!product){
        const error = new Error('Element not found');
        return res.status(404).json({ msg: error.message });
    }
    product.published = !product.published;
    try {
        await product.save();
        res.json({ msg: 'Product published successfully' });
    } catch (error) {
        console.log(error);
        res.status(400).json({ msg: error.message });
    }
}

const updateStock = async (req, res) => {
    const { id } = req.params;
    const data = req.body;
    if(!data.stock || !data.price){
        const error = new Error('Invalid Request');
        return res.status(500).json({ msg: error.message });
    }
    try {
        const element = await Element.findByPk(id);
        element.stock = data.stock;
        element.price = data.price;
        await element.save();
        res.status(200).json({msg: "Stock and price updated successfully"});
    } catch (error) {
        console.log(error);
        return res.status(500).json({ msg: 'Internal Server Error' });
    }
}

export {
    createElement,
    getElements,
    getElement,
    updateElement,
    deleteElement,
    deleteElements,
    publishProduct,
    updateStock
};