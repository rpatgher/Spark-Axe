import { Op, Sequelize } from 'sequelize';
// ************* Models *************
import { Website, Inventory, Order, Element, OrderElement } from '../models/index.js';

const getWebsite = async (req, res) => {
    const website = await Website.findByPk(req.params.id);
    if(!website){
        const error = new Error('Website not found');
        return res.status(404).json({ msg: error.message });
    }
    if(website.user_id.toString() !== req.user.id.toString()){
        const error = new Error('Unauthorized');
        return res.status(401).json({ msg: error.message });
    }
    res.json(website);
}

const createWebsite = async (req, res) => {
    const website = Website.build(req.body);
    const inventory = Inventory.build();
    website.user_id = req.user.id;
    try {
        const websiteSaved = await website.save();
        inventory.website_id = websiteSaved.id;
        await inventory.save();
        res.json({ msg: 'Website created successfully' });
    } catch (error) {
        console.log(error);
        res.status(400).json({ msg: 'An error ocurred' });
    }
}


const getWebsiteMainInfo = async (req, res) => {
    let website = await Website.findByPk(req.params.id, {
        include: [
            {
                model: Inventory,
                as: 'inventory',
                attributes: ['low', 'high']
            }
        ],
        attributes: ['id', 'name', 'user_id']
    });
    const { inventory } = website;
    if(!website){
        const error = new Error('Website not found');
        return res.status(404).json({ msg: error.message });
    }
    if(website.user_id.toString() !== req.user.id.toString()){
        const error = new Error('Unauthorized');
        return res.status(401).json({ msg: error.message });
    }
    website = await Website.findByPk(req.params.id, {
        include: [
            {
                model: Order,
                as: 'orders',
                where: {
                    status: 'IP',
                },
                attributes: ['id', 'status', 'total', 'createdAt'],
                order: [['createdAt', 'DESC']],
                limit: 5
            },
            {
                model: Element,
                as: 'elements',
                where: {
                    stock: {
                        [Op.lt]: inventory.low
                    }
                },
                attributes: ['id', 'name', 'stock'],
                order: [['stock', 'ASC']],
                limit: 5
            }
        ],
        attributes: ['id', 'name']
    });
    const mostSoldProduct = await OrderElement.findAll({
        attributes: [
            'elementId',
            [Sequelize.fn('SUM', Sequelize.col('quantity')), 'most_sold']
          ],
          group: ['elementId'],
          order: [[Sequelize.literal('most_sold'), 'DESC']],
          limit: 1,
          include: [{
            model: Element,
            where: {
                website_id: req.params.id
            },
            attributes: ['name', 'image']
          }]
    });
    const { orders, elements } = website;
    return res.status(200).json({ 
        orders,
        elements,
        inventory,
        mostSoldProduct: mostSoldProduct[0]?.element || null
    });
}

export {
    createWebsite,
    getWebsite,
    getWebsiteMainInfo
};