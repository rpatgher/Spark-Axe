//This document creates and checks if there are categories with subcategories

import { Op } from 'sequelize';
// ************* Models *************
import { Category, Subcategory } from '../models/index.js';


const createCategory = async (req, res) => {
    const { website_id, categories: categoriesBody } = req.body;
    // console.log(categoriesBody);
    if(!website_id || !categoriesBody || categoriesBody.length === 0){
        return res.status(400).json({msg: 'Website id and categories are required'});
    }
    if(categoriesBody.some(category => !category.category) || categoriesBody.some(category => category.category === '')){
        return res.status(400).json({msg: 'Category name is required'});
    }
    if(categoriesBody.some(category => !category.subcategories) || categoriesBody.some(category => category.subcategories.length === 0)){
        return res.status(400).json({msg: 'Subcategories of all categories are required'});
    }
    const currentCategories = await Category.findAll({
        where: {
            website_id
        }
    });
    const numCurrentCategories = currentCategories.length;
    let categories = [];
    let subcategories = [];
    if(categoriesBody){
        categories = categoriesBody.map(category => {
            if(currentCategories.find(currentCategory => currentCategory.name === category.category)){
                return null;
            }
            return {
                name: category.category,
                website_id
            }
        });
    }
    categories = categories.filter(category => category !== null);
    categories.map((category, i) => {
        category.index = numCurrentCategories + i + 1;
    });
    try{
        let categoriesCreated = null;
        if(categories.length > 0){
            categoriesCreated = await Category.bulkCreate(categories);
        }
        const currentSubcategories = await Subcategory.findAll({
            where: {
                category_id: {
                    [Op.or]: currentCategories.map(category => category.id)
                }
            }
        });
        const categoriesElement = await Category.findAll({
            where: {
                name: {
                    [Op.or]: categoriesBody.map(category => category.category)
                }
            }
        });
        const numSubcategories = categoriesElement.map(category => {
            return {
                name: category.name, 
                id: category.id, 
                subcategoriesCount: categoriesBody.find(categoryBody => categoryBody.category === category.name).subcategories.length
            }
        });
        console.log(numSubcategories);
        if(categoriesElement){
            subcategories = categoriesBody.map(category => {
                const categoryId = categoriesElement.find(createdCategory => createdCategory.name === category.category).id;
                return category.subcategories.map((subcategory, i) => {
                    if(currentSubcategories.find(currentSubcategory => currentSubcategory.name === subcategory)){
                        return null;
                    }
                    return {
                        name: subcategory,
                        category_id: categoryId
                    }
                });
            });
        }
        subcategories = subcategories.flat();
        subcategories = subcategories.filter(subcategory => subcategory !== null);
        subcategories.map((subcategory, i) => {
            subcategory.index = numSubcategories.find(category => category.name === categoriesElement.find(category => category.id === subcategory.category_id).name).subcategoriesCount + i;
        });
        console.log(subcategories);
        if(subcategories.length > 0){
            await Subcategory.bulkCreate(subcategories);
        }
        // return res.json(categoriesBody.map(category => category.subcategories).flat());
        const subcategoriesElement = await Subcategory.findAll({
            where: {
                category_id: {
                    [Op.or]: categoriesElement.map(category => category.id)
                },
                name: {
                    [Op.or]: categoriesBody.map(category => category.subcategories).flat()
                }
            }
        });
        const subcategoriesCreatedIds = subcategoriesElement.map(subcategory => subcategory.id);
        return res.status(200).json({
            msg: 'Categories and subcategories created successfully',
            subcategoriesIds: subcategoriesCreatedIds
        });
    }catch(error){
        console.error(error);
        return res.status(500).json({msg: error.message});
    }
}

const getCategories = async (req, res) => {
    const { id: website_id } = req.params;
    if(!website_id){
        return res.status(400).json({msg: 'Website id is required'});
    }
    try{
        const categories = await Category.findAll({
            where: {
                website_id
            },
            include: {
                model: Subcategory,
                as: 'subcategories',
                attributes: ['id', 'name']
            },
            attributes: ['id', 'name'],
        });
        return res.json(categories);
    }catch(error){
        console.error(error);
        return res.status(500).json({msg: error.message});
    }
}


export {
    createCategory,
    getCategories
}