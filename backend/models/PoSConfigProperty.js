import { DataTypes } from "sequelize";
import db from "../config/db.js";

const PoSConfigProperty = db.define('pos_config_property', {
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4
    }
}, {});


export default PoSConfigProperty;