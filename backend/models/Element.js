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
    cost : {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0
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
        type: DataTypes.STRING(3000),
        allowNull: false,
        defaultValue: '[{"type":"paragraph","children":[{"text":""}]}]'
    },
    ingredients: {
        type: DataTypes.STRING(3000),
        allowNull: false,
        defaultValue: '[{"type":"paragraph","children":[{"text":""}]}]'
    },
    weight: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    performance: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    content: {
        type: DataTypes.FLOAT,
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
    wholesaler: {
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