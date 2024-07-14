import crypto from 'crypto';
import Website from "../models/Website.js";

const validateWebsite = async (req, res, next) => {
    const hash = req.headers['x-client-hash'];
    const apiKey = req.headers['x-client-api-key'];
    const websiteName = req.headers['x-client-website'];
    if (!hash) {
        return res.status(403).json({ message: 'Missing information of authorization' });
      }
    try {
        const serverHash = crypto.createHmac('sha256', process.env.SECRET_KEY).update(apiKey).digest('hex');
        if (serverHash !== hash) {
            return res.status(403).json({ message: 'Invalid authorization' });
        }
        const website = await Website.findOne({where: {name: websiteName}});
        if (!website) {
            return res.status(403).json({ message: 'Website not found' });
        }
        req.website = website;
    } catch (error) {
        console.error(error);
        return res.status(403).json({msg: 'An error occurred'});
    }
    next();
}

export default validateWebsite;