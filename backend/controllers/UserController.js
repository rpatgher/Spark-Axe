import { Op } from 'sequelize';

// ************* Helpers *************
import generateJWT from '../helpers/generateJWT.js';
import generateToken from '../helpers/generateToken.js';
import sendEmail from '../helpers/sendEmail.js';

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
        user.confirmed = false;
        const token = generateToken();
        user.confirmationToken = token;
        await user.save();
        // TODO: Send confirmation email
        sendEmail({
            name: `${user.name} ${user.lastname}`,
            email: user.email,
            url: `${process.env.FRONTEND_URLS.split(',')[0]}/confirm-account/${token}`,
            subject: 'Confirm your account',
            file: 'confirm-account'
        });
        res.status(201).json({ msg: 'Registered succesfully' });
    } catch (error) {
        console.log(error);
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
        });
    }
}

const forgotPassword = async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ 
        where: { email },
        include: [ Website ]
    });
    if(!user){
        const error = new Error('User not found');
        return res.status(404).json({ msg: error.message });
    }
    const token = generateToken();
    user.resetPasswordToken = token;
    await user.save();
    sendEmail({
        name: `${user.name} ${user.lastname}`,
        email: user.email,
        url: `${process.env.FRONTEND_URLS.split(',')[0]}/reset-password/${token}`,
        subject: 'Reset your password',
        file: 'reset-password'
    });
    return res.status(200).json({ msg: 'Email sent successfully' });
}

const resetPassword = async (req, res) => {
    const { token, password } = req.body;
    try {
        const user = await User.findOne({ where: { resetPasswordToken: token }});
        if(!user){
            const error = new Error('Invalid token');
            return res.status(400).json({ msg: error.message });
        }
        user.password = password;
        user.resetPasswordToken = null;
        await user.save();
        return res.status(200).json({ msg: 'Password updated successfully' });
    } catch (error) {
        console.log(error);
        return res.status(400).json({ msg: 'An error ocurred' });   
    }
}

const confirmUser = async (req, res) => {
    const { token } = req.body;
    try {
        const user = await User.findOne({ where: { confirmationToken: token }});
        if(!user){
            const error = new Error('Invalid token');
            return res.status(400).json({ msg: error.message });
        }
        user.confirmed = true;
        user.confirmationToken = null;
        await user.save();
        return res.status(200).json({ msg: 'User confirmed successfully' });
    } catch (error) {
        console.log(error);
        return res.status(400).json({ msg: 'An error ocurred' });
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
    res.status(200).json(user);
}

export {
    register,
    login,
    profile,
    forgotPassword,
    confirmUser,
    resetPassword
}