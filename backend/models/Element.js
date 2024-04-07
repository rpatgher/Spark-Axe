import { DataTypes } from "sequelize";
import db from "../config/db.js";

const Element = db.define('element', {
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
    description: {
        type: DataTypes.STRING,
        allowNull: false
    },
    price: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    color: {
        type: DataTypes.STRING,
        allowNull: false
    },
    image: {
        type: DataTypes.STRING,
        allowNull: false
    },
    image_hover: {
        type: DataTypes.STRING,
    },
    stock: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    published: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
}, {});


export default Element;