import { Op } from 'sequelize';

// ************* Helpers *************
import generateJWT from '../helpers/generateJWT.js';

// ************* Models *************
import { User, Website } from '../models/index.js';


const register = async (req, res) => {
    const { email, phone } = req.body;
    const userExists = await User.findOne({
        where: {
            [Op.or]: [
                { email },
                { phone }
            ]
        }
    });
    if(userExists){
        const error = new Error('User already exists');
        return res.status(400).json({ msg: error.message });
    }
    try {
        const user = User.build(req.body);
        // TODO: Generate Token
        await user.save();
        // TODO: Send confirmation email
        res.json({ msg: 'Registered succesfully' });
    } catch (error) {
        console.log(error);
        // TODO: Define better error handling
        return res.status(400).json({ msg: 'An error ocurred' });
    }
}

const login = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email }, include: [ Website ]});
    if(!user){
        const error = new Error('User not found');
        return res.status(404).json({ msg: error.message });
    }
    if(!user.confirmed){
        const error = new Error('User is not confirmed');
        return res.status(401).json({ msg: error.message });
    }
    if(!user.comparePassword(password)){
        const error = new Error('Invalid password');
        return res.status(401).json({ msg: error.message });
    }else{
        res.json({
            msg: 'Logged in successfully',
            id: user.id,
            name: user.name,
            lastname: user.lastname,
            email: user.email,
            role: user.role,
            token: generateJWT(user.id),
            websites: user.websites
            // TODO: Return token
        });
    }
}

const profile = async (req,res) => {
    const { id } = req.user;
    const user = await User.findOne({
        where: { id },
        include: [
            { model: Website }
        ]
    });
    console.log(user);
    res.json(user);
}

export {
    register,
    login,
    profile
}