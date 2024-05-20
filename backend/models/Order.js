import { DataTypes } from "sequelize";
import db from "../config/db.js";

const Order = db.define('order', {
    id: {
        type: DataTypes.INTEGER.ZEROFILL,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
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