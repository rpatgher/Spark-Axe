import { DataTypes } from "sequelize";
import bcrypt from 'bcrypt';
import db from "../config/db.js";

const Customer = db.define('customer', {
    id: {
        type: DataTypes.INTEGER.ZEROFILL,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
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
    phone: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    confirmed: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    token: {
        type: DataTypes.STRING
    }
}, {
    hooks:{
        beforeSave: async (customer) => {
            if(customer.changed('password')){
                customer.password = Customer.prototype.hashPassword(customer.password);
            }
        }
    },
    scopes:{
        withoutPassword: {
            attributes: { exclude: ['password', 'token', 'createdAt', 'updatedAt', 'website_id'] }
        }
    }
});

Customer.prototype.hashPassword = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
}
Customer.prototype.comparePassword = function(password) {
    return bcrypt.compareSync(password, this.password);
}



export default Customer;