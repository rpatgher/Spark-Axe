import { DataTypes } from "sequelize";
import db from "../config/db.js";

const Element = db.define('element', {
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
    instructions: {
        type: DataTypes.STRING,
        allowNull: false
    },
    fact_sheet: {
        type: DataTypes.STRING,
        allowNull: false
    },
    safety_sheet: {
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
    main:{
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    published: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
}, {});


export default Element;