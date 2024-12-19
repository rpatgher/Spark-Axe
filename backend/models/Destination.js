import { DataTypes } from "sequelize";
import db from "../config/db.js";

const Destination = db.define('destination', {
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
    },
    website_id: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    delivery_id: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    state: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    city: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    cost: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
}, {});

export default Destination;