import { DataTypes } from "sequelize";
import bcrypt from 'bcrypt';
import db from "../config/db.js";

const User = db.define('user', {
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    lastname: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: false
    },
    role: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'Admin'
    },
    token: {
        type: DataTypes.STRING
    },
    confirmationToken: {
        type: DataTypes.STRING
    },
    resetPasswordToken: {
        type: DataTypes.STRING
    },
    confirmed: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
}, {
    hooks:{
        beforeSave: async (user) => {
            if(user.changed('password')){
                user.password = User.prototype.hashPassword(user.password);
            }
        }
    },
    scopes:{
        withoutPassword: {
            attributes: { exclude: ['password', 'token', 'confirmed', 'createdAt', 'updatedAt'] }
        }
    }
});

User.prototype.hashPassword = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
}
User.prototype.comparePassword = function(password){
    return bcrypt.compareSync(password, this.password);
}

export default User;