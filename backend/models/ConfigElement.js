import { DataTypes } from "sequelize";
import db from "../config/db.js";

const ConfigElement = db.define('config_element', {
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4 
    },
    color: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    image_hover: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    main: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    instructions: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
}, {});

export default ConfigElement;