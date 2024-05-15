// ************* Models *************
import { Website, Inventory } from '../models/index.js';

const getInventory = async (req, res) => {
    try {
        const website_id = req.params.website_id;
        const website = await Website.findByPk(website_id);
        if (!website) {
            return res.status(404).json({ msg: 'Website not found' });
        }
        const inventory = await Inventory.findOne({ where: { website_id } });
        if (!inventory) {
            return res.status(404).json({ msg: 'Inventory not found' });
        }
        res.status(200).json(inventory);
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'There was an error' });
    }
}

const updateInventory = async (req, res) => {
    const { low, high } = req.body;
    try {
        if(!low || !high){
            return res.status(400).json({ msg: 'Values must be provided' });
        }
        if(low < 0 || high < 0){
            return res.status(400).json({ msg: 'Values must be positive' });
        }
        if(low > high){
            return res.status(400).json({ msg: 'Low value must be less than high value' });
        }
        const website_id = req.params.website_id;
        const website = await Website.findByPk(website_id);
        if (!website) {
            return res.status(404).json({ msg: 'Website not found' });
        }
        let inventory = await Inventory.findOne({ where: { website_id } });
        if (!inventory) {
            inventory = await Inventory.create({ website_id });
        }
        inventory.low = low;
        inventory.high = high;
        await inventory.save();
        res.status(200).json(inventory);
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'There was an error' });
    }
}

export {
    getInventory,
    updateInventory
};