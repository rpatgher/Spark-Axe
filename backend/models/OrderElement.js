import { DataTypes } from "sequelize";
import db from "../config/db.js";

const OrderElement = db.define('order_element', {
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {});

export default OrderElement;