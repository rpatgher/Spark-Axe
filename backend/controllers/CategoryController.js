//This document creates and checks if there are categories with subcategories

import { Op } from 'sequelize';
// ************* Models *************
import { Category, Subcategory, Website } from '../models/index.js';


const createCategories = async (req, res) => {
    const { website_id, categories: categoriesBody } = req.body;
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


const editSubcategory = async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    if(!id){
        return res.status(400).json({msg: 'Category id is required'});
    }
    if(!name || name === ''){
        return res.status(400).json({msg: 'Category name is required'});
    }
    const subcategory = await Subcategory.findByPk(id, {
        include: {
            model: Category,
            as: 'category',
            attributes: ['id', 'name', 'website_id'],
            include: {
                model: Website,
                as: 'website',
                attributes: ['id', 'name', 'user_id']
            },
        },
        attributes: ['id', 'name', 'category_id'],
    });
    if(subcategory.category.website.user_id.toString() !== req.user.id.toString()){
        return res.status(401).json({msg: 'Unauthorized'});
    }
    if(!subcategory){
        return res.status(404).json({msg: 'Subcategory not found'});
    }
    subcategory.name = name;
    try{
        await subcategory.save();
        return res.json({msg: 'Subcategory updated successfully'});
    }
    catch(error){
        console.error(error);
        return res.status(500).json({msg: error.message});
    }
}



const deleteSubcategory = async (req, res) => {
    const { id } = req.params;
    if(!id){
        return res.status(400).json({msg: 'Subcategory id is required'});
    }
    const subcategory = await Subcategory.findByPk(id, {
        include: {
            model: Category,
            as: 'category',
            attributes: ['id', 'name', 'website_id'],
            include: {
                model: Website,
                as: 'website',
                attributes: ['id', 'name', 'user_id']
            },
        },
        attributes: ['id', 'name', 'category_id'],
    });
    if(subcategory.category.website.user_id.toString() !== req.user.id.toString()){
        return res.status(401).json({msg: 'Unauthorized'});
    }
    if(!subcategory){
        return res.status(404).json({msg: 'Category not found'});
    }
    try{
        await subcategory.destroy();
        const subcategories = await Subcategory.findAll({
            where: {
                category_id: subcategory.category_id
            },
            order: [['index', 'ASC']]
        });
        await Promise.all(subcategories.map(async (subcategory, i) => {
            subcategory.index = i + 1;
            await subcategory.save();
        }));
        return res.json({msg: 'Subcategory deleted successfully'});
    }catch(error){
        console.error(error);
        if(error.name === 'SequelizeForeignKeyConstraintError'){
            return res.status(400).json({msg: 'Subcategory cannot be deleted because it is being used'});
        }
        return res.status(500).json({msg: error.message});
    }
}


const editCategory = async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    if(!id){
        return res.status(400).json({msg: 'Category id is required'});
    }
    if(!name || name === ''){
        return res.status(400).json({msg: 'Category name is required'});
    }
    const category = await Category.findByPk(id, {
        include: {
            model: Website,
            as: 'website',
            attributes: ['id', 'name', 'user_id']
        },
        attributes: ['id', 'name', 'website_id'],
    });
    if(category.website.user_id.toString() !== req.user.id.toString()){
        return res.status(401).json({msg: 'Unauthorized'});
    }
    if(!category){
        return res.status(404).json({msg: 'Category not found'});
    }
    category.name = name;
    try{
        await category.save();
        return res.status(200).json({msg: 'Category updated successfully'});
    }
    catch(error){
        console.error(error);
        return res.status(500).json({msg: error.message});
    }
}

const deleteCategory = async (req, res) => {
    const { id } = req.params;
    if(!id){
        return res.status(400).json({msg: 'Category id is required'});
    }
    const category = await Category.findByPk(id, {
        include: {
            model: Website,
            as: 'website',
            attributes: ['id', 'name', 'user_id']
        },
        attributes: ['id', 'name', 'website_id'],
    });
    if(category.website.user_id.toString() !== req.user.id.toString()){
        return res.status(401).json({msg: 'Unauthorized'});
    }
    if(!category){
        return res.status(404).json({msg: 'Category not found'});
    }
    try{
        await category.destroy();
        const categories = await Category.findAll({
            where: {
                website_id: category.website_id
            },
            order: [['index', 'ASC']]
        });
        await Promise.all(categories.map(async (category, i) => {
            category.index = i + 1;
            await category.save();
        }));
        return res.json({msg: 'Category deleted successfully'});
    }catch(error){
        console.error(error);
        if(error.name === 'SequelizeForeignKeyConstraintError'){
            return res.status(400).json({msg: 'Category cannot be deleted because it is being used'});
        }
        return res.status(500).json({msg: error.message});
    }
}

const createOneCategory = async (req, res) => {
    const { website_id, category } = req.body;
    if(!website_id || !category || category === ''){
        return res.status(400).json({msg: 'Website id and category name are required'});
    }
    const website = await Website.findByPk(website_id);
    if(!website){
        return res.status(404).json({msg: 'Website not found'});
    }
    if(website.user_id.toString() !== req.user.id.toString()){
        return res.status(401).json({msg: 'Unauthorized'});
    }
    const currentCategories = await Category.findAll({
        where: {
            website_id
        }
    });
    const numCurrentCategories = currentCategories.length;
    let categories = [];
    if(!currentCategories.find(currentCategory => currentCategory.name === category)){
        categories.push({
            name: category,
            website_id,
            index: numCurrentCategories + 1
        });
    }else{
        return res.status(400).json({msg: 'Category already exists'});
    }
    try{
        let categoriesCreated = null;
        if(categories.length > 0){
            categoriesCreated = await Category.bulkCreate(categories);
        }
        return res.status(200).json(categoriesCreated);
    } catch (error) {
        console.error(error);
        return res.status(500).json({msg: error.message});
    }
}

const createOneSubcategory = async (req, res) => {
    const { category_id, subcategory } = req.body;
    if(!category_id || !subcategory || subcategory === ''){
        return res.status(400).json({msg: 'Category id and subcategory name are required'});
    }
    const category = await Category.findByPk(category_id, {
        include: {
            model: Website,
            as: 'website',
            attributes: ['id', 'name', 'user_id']
        },
        attributes: ['id', 'name', 'website_id'],
    });
    if(!category){
        return res.status(404).json({msg: 'Category not found'});
    }
    if(category.website.user_id.toString() !== req.user.id.toString()){
        return res.status(401).json({msg: 'Unauthorized'});
    }
    const currentSubcategories = await Subcategory.findAll({
        where: {
            category_id
        }
    });
    const numCurrentSubcategories = currentSubcategories.length;
    let subcategories = [];
    if(!currentSubcategories.find(currentSubcategory => currentSubcategory.name === subcategory)){
        subcategories.push({
            name: subcategory,
            category_id,
            index: numCurrentSubcategories + 1
        });
    } else {
        return res.status(400).json({msg: 'Subcategory already exists'});
    }
    try{
        let subcategoriesCreated = null;
        if(subcategories.length > 0){
            subcategoriesCreated = await Subcategory.bulkCreate(subcategories);
        }
        return res.status(200).json(subcategoriesCreated);
    } catch (error) {
        console.error(error);
        return res.status(500).json({msg: error.message});
    }
}


export {
    createCategories,
    getCategories,
    editSubcategory,
    deleteSubcategory,
    editCategory,
    deleteCategory,
    createOneCategory,
    createOneSubcategory
}