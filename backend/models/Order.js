import { DataTypes } from "sequelize";
import db from "../config/db.js";

const Order = db.define('order', {
    id: {
        type: DataTypes.INTEGER.ZEROFILL,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    deadline: {
        type: DataTypes.DATE,
        allowNull: false
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
}, {});

export default Order;