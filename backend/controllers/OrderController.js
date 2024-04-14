// ************* Models *************
import { OrderElement, Order, Website, Element } from '../models/index.js';

const getOrders = async (req, res) => {
    const { website_id } = req.params;
    const website = await Website.findByPk(website_id);
    if (!website) {
        return res.status(400).json({ msg: 'Website not found' });
    }
    try {
        const orders = await Order.findAll({
            where: {
                website_id
            },
            include: {
                model: Element,
                attributes: ['id', 'name', 'price'],
                through: {
                    attributes: ['quantity']
                }
            }
        });
        res.json(orders);
    } catch (error) {
        console.log(error);
        res.status(400).json({ msg: error.message });
    }
}

const createOrder = async (req, res) => {
    const { deadline, status, notes, elements } = req.body;
    const { website_id } = req.params;
    const website = await Website.findByPk(website_id);
    if (!website) {
        return res.status(400).json({ msg: 'Website not found' });
    }
    if (!deadline || !status || !elements || !website_id) {
        return res.status(400).json({ msg: 'All fields are required' });
    }
    const productsFromDB = await Element.findAll({
        where: {
            id: elements.map(product => product.id)
        },
        attributes: ['id', 'stock', 'price']
    })
    if (!productsFromDB) return res.status(400).json({ msg: 'Products not found' });
    const products = elements.map(product => {
        const productFromDB = productsFromDB.find(p => p.id === product.id);
        if (product.quantity > productFromDB.stock) {
            return res.status(400).json({ msg: 'Not enough stock' });
        }
        return {
            id: productFromDB.id,
            quantity: product.quantity,
            price: productFromDB.price
        }
    });
    const order = await Order.create({
        deadline,
        status,
        notes,
        total: products.reduce((acc, product) => acc + product.price * product.quantity, 0),
        website_id
    });
    products.forEach(async product => {
        await Element.decrement('stock', {
            by: product.quantity,
            where: {
                id: product.id
            }
        });
    });
    try {
        const createdOrder = await order.save();
        const orderElement = products.map(product => {
            return {
                orderId: createdOrder.id,
                elementId: product.id,
                quantity: product.quantity
            }
        });
        await OrderElement.bulkCreate(orderElement);
        res.json({ msg: 'Order created successfully' });
    } catch (error) {
        console.log(error);
        res.status(400).json({ msg: error.message });
    }
}


export{
    createOrder,
    getOrders
}