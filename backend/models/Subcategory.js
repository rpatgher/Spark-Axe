import { DataTypes } from "sequelize";
import db from "../config/db.js";

const Subcategory = db.define('subcategory', {
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
    },
    image: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: ''
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: ''
    },
});

export default Subcategory;