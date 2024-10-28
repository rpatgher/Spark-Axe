import { Op } from 'sequelize';

// ************* Helpers *************
import generateJWT from '../helpers/generateJWT.js';
import generateToken from '../helpers/generateToken.js';
import sendEmail from '../helpers/sendEmail.js';

// ************* Models *************
import { Customer, Element, Category, Subcategory, Advertisement, PoS, Section } from '../models/index.js';


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
    const pos = await PoS.findAll({
        where: {
            website_id: website.id
        }
    });
    res.json({
        elements,
        categories,
        advertisements,
        pos
    });
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

export {
    getOrders,
    getInfo
}