import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Website from "../models/Website.js";

const checkAuth = async (req, res, next) => {
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET)
            const user = await User.scope('withoutPassword').findByPk(decoded.id);
            if(user){
                req.user = user;
            }else{
                const error = new Error('An error occurred');
                return res.status(404).json({msg: error.message});
            }
            return next();
        } catch (error) {
            console.error(error);
            return res.status(404).json({msg: 'An error occurred'});
        }
    }
    if(!token){
        const error = new Error('Invalid token');
        return res.status(401).json({msg: error.message});
    }
    next();
}

export default checkAuth;