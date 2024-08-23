import { DataTypes } from "sequelize";
import db from "../config/db.js";

const WebsiteFeature = db.define('website_feature', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    }
}, {});

export default WebsiteFeature;