
// ************* Models *************
import { Element, Website, Category, Subcategory, Advertisement, Section } from '../models/index.js';


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
    getInfo
}