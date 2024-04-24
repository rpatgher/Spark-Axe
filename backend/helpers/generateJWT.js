import jwt from 'jsonwebtoken';

const generateJWT = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });
}

export default generateJWT;

//JWT stands for JSON Web Token.