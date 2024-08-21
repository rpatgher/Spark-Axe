import crypto from 'crypto';

const generateToken = (user) => {
    return  crypto.randomBytes(20).toString('hex');
}

export default generateToken;