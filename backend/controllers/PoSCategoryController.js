// ************* Models *************
import { PoSCategory, Website } from '../models/index.js';


const getCategories = async (req, res) => {
    const { website_id } = req.params;
    if(website_id === ''){
        return res.status(400).json({ message: 'Website ID is required' });
    }
    const website = await Website.findByPk(website_id);
    if(!website){
        return res.status(404).json({ message: 'Website not found' });
    }
    if(website.user_id.toString() !== req.user.id.toString()){
        return res.status(401).json({ message: 'Unauthorized' });
    }
    const sections = await PoSCategory.findAll({
        where: { website_id },
        attributes: ['id', 'name'],
    });
    return res.status(200).json(sections);
}


export {
    getCategories
}