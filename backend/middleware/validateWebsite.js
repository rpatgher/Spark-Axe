import crypto from 'crypto';
import Website from "../models/Website.js";

// ************** Helper **************
import decryptWord from '../helpers/decryptWord.js';

const validateWebsite = async (req, res, next) => {
    const hash = req.headers['x-client-hash'];
    const websiteName = req.headers['x-client-website'];
    if (!hash) {
        return res.status(403).json({ message: 'Missing information of authorization' });
    }
    if (!websiteName) {
        return res.status(403).json({ message: 'Missing information of website' });
    }
    try {
        // Validate the hash to know if the request is from an authorized client
        const serverHash = crypto.createHmac('sha256', process.env.SECRET_KEY).update(process.env.API_KEY).digest('hex');
        if (serverHash !== hash) {
            return res.status(403).json({ message: 'Invalid authorization' });
        }
        // Decrypt the website name
        const websiteNameDecrypted = decryptWord(websiteName);
        const website = await Website.findOne({
            where: { name: websiteNameDecrypted }
        });
        // Validate if the website exists
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