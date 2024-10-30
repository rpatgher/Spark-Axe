import { Op } from 'sequelize';

// ************* Helpers *************
import generateJWT from '../helpers/generateJWT.js';
import generateToken from '../helpers/generateToken.js';
import sendEmail from '../helpers/sendEmail.js';


// ************* Models *************
import { Element, Website, Category, Subcategory, Advertisement, Section, Customer, Order, OrderElement } from '../models/index.js';


const getElements = async (req, res) => {
    const { website } = req;
    if(!website){
        const error = new Error('Website not found');
        return res.status(404).json({ msg: error.message });
    }
    let elements = await Element.findAll({
        where: {
            website_id: website.id,
            published: true
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
            name: element.name,
            description: element.description,
            image: element.image,
            image_hover: element.image_hover,
            price: element.price,
            stock: element.stock,
            color: element.color,
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
    const categories = await Category.findAll({
        where: {
            website_id: website.id
        },
        include: [
            {
                model: Subcategory,
                attributes: { exclude: ['id', 'category_id', 'createdAt', 'updatedAt'] }
            }
        ],
        attributes: { exclude: ['id', 'website_id','createdAt', 'updatedAt'] }
    });
    res.json({elements, categories});
}

const getOrders = async (req, res) => {
    const { customer } = req;
    const { website } = req;
    if(customer.website_id !== website.id){
        return res.status(401).json({ msg: 'User not allowed' });
    }
    try {
        const orders = await customer.getOrders({
            where: {
                customer_id: customer.id,
                status: {
                    [Op.not]: 'C'
                }
            },
            include: [
                {
                    model: Element,
                    attributes: ['id', 'name', 'price', 'image'],
                    through: {
                        attributes: ['quantity']
                    }
                }
            ]
        });
        return res.status(200).json(orders);
    } catch (error) {
        console.log(error);
        return res.status(400).json({ msg: 'An error ocurred' });
    }
}


const getInfo = async (req, res) => {
    const { website } = req;
    if(!website){
        const error = new Error('Website not found');
        return res.status(404).json({ msg: error.message });
    }
    const elements = await Element.findAll({
        where: {
            website_id: website.id,
            published: true
        },
        include: [
            {
                model: Subcategory,
                attributes: { exclude: ['category_id', 'createdAt', 'updatedAt', 'index', 'element_subcategory'] },
                include: [
                    {
                        model: Category,
                        attributes: { exclude: ['website_id', 'createdAt', 'updatedAt'] },
                        order: [
                            ['index', 'ASC']
                        ]
                    }
                ]
            }
        ],
        attributes: { exclude: ['website_id', 'createdAt', 'updatedAt'] },
        order: [
            ['index', 'ASC']
        ]
    });
    const categories = await Category.findAll({
        where: {
            website_id: website.id
        },
        include: [
            {
                model: Subcategory,
                attributes: { exclude: ['category_id', 'createdAt', 'updatedAt'] },
                order: [
                    ['index', 'ASC']
                ]
            }
        ],
        attributes: { exclude: ['website_id','createdAt', 'updatedAt'] },
        order: [
            ['index', 'ASC']
        ]
    });
    const advertisements = await Advertisement.findAll({
        include: [
            {
                model: Section,
                where: {
                    website_id: website.id
                },
                attributes: { exclude: ['website_id', 'createdAt', 'updatedAt'] }
            }
        ],
        attributes: { exclude: ['section_id', 'createdAt', 'updatedAt'] }
    });
    res.json({
        elements,
        categories,
        advertisements
    });
}

export {
    getElements,
    getOrders,
    getInfo
}