import { DataTypes } from "sequelize";
import db from "../config/db.js";

const ElementConfigProperty = db.define('element_config_property', {
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4 
    },
    unit: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {});

export default ElementConfigProperty;