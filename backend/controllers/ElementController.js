//These functions handle various operations related to elements in your application. They interact with your database to create, read, update, and delete elements. They also perform checks to ensure that users are authorized to perform these operations.
import fs from 'fs';
import { Op } from 'sequelize';

// ************* Models *************
import { Element, Website, ElementCategory, Category, Subcategory, Order, OrderElement } from '../models/index.js';

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
        index: elementFromDB.index,
        name: elementFromDB.name,
        description: elementFromDB.description,
        image: elementFromDB.image,
        image_hover: elementFromDB.image_hover,
        price: elementFromDB.price,
        stock: elementFromDB.stock,
        color: elementFromDB.color,
        main: elementFromDB.main,
        published: elementFromDB.published,
        categories: elementFromDB.subcategories.map(subcategory => {
            return {
                id: subcategory.id,
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
    let elements = await Element.findAll({
        where: {
            website_id: website.id,
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
    elements = elements.map(element => {
        const newElement = {
            id: element.id,
            index: element.index,
            name: element.name,
            description: element.description,
            image: element.image,
            image_hover: element.image_hover,
            price: element.price,
            stock: element.stock,
            color: element.color,
            main: element.main,
            published: element.published,
            categories: element.subcategories.map(subcategory => {
                return {
                    category: subcategory.category.name,
                    subcategory: subcategory.name,
                }
            })
        }
        let categories = newElement.categories.reduce((acc, current) => {
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
        newElement.categories = categories;
        return newElement;
    });
    return res.status(200).json(elements);
}

const createElement = async (req, res) => {
    const { name, description, price, stock , categories: categoriesStr } = req.body;
    const categories = JSON.parse(categoriesStr);
    if(!name || !description || !price || !stock || !categories){
        const error = new Error('Invalid Request. Missing required fields');
        return res.status(400).json({ msg: error.message });
    }
    if (!req.files || Object.keys(req.files).length === 0) {
        const error = new Error('No files were uploaded.');
        return res.status(400).json({ msg: error.message });
    }
    const website = await Website.findByPk(req.body.website_id);
    if(!website){
        const error = new Error('Website not found');
        return res.status(404).json({ msg: error.message });
    }
    if(website.user_id.toString() !== req.user.id.toString()){
        const error = new Error('Unauthorized');
        return res.status(401).json({ msg: error.message });
    }
    const numElements = await Element.count({where: {website_id: website.id}});
    const element = Element.build(req.body);
    element.index = numElements + 1;
    element.website_id = website.id;
    element.image = req.files.image[0].filename;
    if(req.files.image2){
        element.image_hover = req.files.image2[0].filename;
    }
    try {
        const createdElement = await element.save();
        const currentCategories = await Category.findAll({
            where: {
                website_id: website.id
            }
        });
        const numCurrentCategories = currentCategories.length;
        // Save categories
        const createdCategories = await Promise.all(await categories.map(async (category, i) => {
            const [createdCategory, created] = await Category.findOrCreate({
                where: {
                    name: category.category,
                    website_id: website.id
                },
                defaults: {
                    index: numCurrentCategories + i + 1
                }
            });
            const numSubcategories = await Subcategory.count({
                where: {
                    category_id: createdCategory.id
                }
            });
            const createdSubcategories = await Promise.all(await category.subcategories.map(async (subcategory, i) => {
                const [createdSubcategory, created2] = await Subcategory.findOrCreate({
                    where: {
                        name: subcategory,
                        category_id: createdCategory.id
                    },
                    defaults: {
                        index: numSubcategories + i + 1
                    }
                });
                const elementCategory = {
                    elementId: createdElement.id,
                    subcategoryId: createdSubcategory.id
                }
                await ElementCategory.findOrCreate({
                    where: elementCategory,
                });
                return createdSubcategory;
            }));
            return {
                ...createdCategory,
                subcategories: createdSubcategories
            };
        }));
        return res.json({ msg: 'Element created successfully' });
    } catch (error) {
        console.log(error);
        res.status(400).json({ msg: error.message });
    }
}

const updateElement = async (req, res) => {
    const { name, description, price, stock , categories: categoriesStr } = req.body;
    const categories = JSON.parse(categoriesStr);
    if(!name || !description || !price || !stock || !categories){
        const error = new Error('Invalid Request. Missing required fields');
        return res.status(400).json({ msg: error.message });
    }
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
    // Delete old images from the server
    if(req.files.image){
        fs.unlinkSync(`public/uploads/elements/${elementFromDB.image}`);
    }
    if(req.files.image2){
        fs.unlinkSync(`public/uploads/elements/${elementFromDB.image_hover}`);
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
        // Save categories
        const currentCategories = await Category.findAll({
            where: {
                website_id: website.id
            }
        });
        const numCurrentCategories = currentCategories.length;
        const createdCategories = await Promise.all(await categories.map(async (category, i) => {
            const [createdCategory, created] = await Category.findOrCreate({
                where: {
                    name: category.category,
                    website_id: website.id
                },
                defaults: {
                    index: numCurrentCategories + i + 1
                }
            });
            const numSubcategories = await Subcategory.count({
                where: {
                    category_id: createdCategory.id
                }
            });
            const createdSubcategories = await Promise.all(await category.subcategories.map(async (subcategory, i) => {
                const [createdSubcategory, created2] = await Subcategory.findOrCreate({
                    where: {
                        name: subcategory,
                        category_id: createdCategory.id
                    },
                    defaults: {
                        index: numSubcategories + i + 1
                    }
                });
                const elementCategory = {
                    elementId: elementFromDB.id,
                    subcategoryId: createdSubcategory.id
                }
                await ElementCategory.findOrCreate({
                    where: elementCategory,
                });
                return createdSubcategory;
            }));
            return {
                ...createdCategory,
                subcategories: createdSubcategories
            };
        }));
        return res.json({ msg: 'Element updated successfully' });
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
        if(error?.original?.code === 'ER_ROW_IS_REFERENCED_2'){
            return res.status(400).json({ msg: 'Cannot delete this element' });
        }
        return res.status(400).json({ msg: error.message });
    } 
}

const deleteElements = async (req, res) => {
    const elements = await Element.findAll({
        where: {
            id: {
                [Op.in]: req.body.ids
            }
        }
    });
    console.log(elements);
    // Check if the user is authorized to delete the elements
    const website = await Website.findOne({
        where: {
            id: {
                [Op.in]: elements.map(element => element.website_id)
            },
            user_id: req.user.id
        }
    });
    if(!website){
        const error = new Error('Unauthorized');
        return res.status(401).json({ msg: error.message });
    }
    const deletedElements = await Promise.all(elements.map(async element => {
        try {
            const deletedElement = await Element.destroy({
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
            return deletedElement;
        } catch (error) {
            return error;
        }
    }));
    if(deletedElements.some(element => element instanceof Error)){
        if(deletedElements.some(element => element?.original?.code === 'ER_ROW_IS_REFERENCED_2')){
            const currentElements = deletedElements.filter(element => !(element instanceof Error));
            return res.status(400).json({ msg: 'Cannot delete some elements', elements: currentElements });
        }
        return res.status(400).json({ msg: 'An error ocurred' });
    } else {
        return res.json({ msg: 'Elements deleted successfully' });
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
    if(data.stock === undefined  || data.price === undefined || data.stock === null || data.price === null){
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