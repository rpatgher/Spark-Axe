import { DataTypes } from "sequelize";
import db from "../config/db.js";

const Inventory = db.define('inventory', {
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4
    },
    low: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 10
    },
    high: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 30
    },
}, {});

export default Inventory;