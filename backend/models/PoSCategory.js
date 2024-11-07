import { DataTypes } from "sequelize";
import db from "../config/db.js";

const PoSCategory = db.define('pos_category', {
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {});

export default PoSCategory;