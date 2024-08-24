import { DataTypes } from "sequelize";
import db from "../config/db.js";

const Category = db.define('category', {
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
    name: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

export default Category;