import { DataTypes } from "sequelize";
import db from "../config/db.js";

const Config = db.define('config', {
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4 
    }
}, {});

export default Config;