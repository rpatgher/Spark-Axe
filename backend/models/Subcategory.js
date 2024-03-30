import { DataTypes } from "sequelize";
import db from "../config/db.js";

const Subcategory = db.define('subcategory', {
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
});

export default Subcategory;