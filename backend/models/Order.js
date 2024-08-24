import { DataTypes } from "sequelize";
import db from "../config/db.js";

const Order = db.define('order', {
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4 
    },
    index: {
        type: DataTypes.INTEGER.ZEROFILL,
        allowNull: false,
    },
    delivery_date: {
        type: DataTypes.DATE
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false
    },
    notes: {
        type: DataTypes.STRING
    },
    total: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    address:{
        type: DataTypes.STRING,
        allowNull: false
    }
}, {});

export default Order;