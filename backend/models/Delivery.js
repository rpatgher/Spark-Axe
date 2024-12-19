import { DataTypes } from "sequelize";
import db from "../config/db.js";

const Delivery = db.define("delivery", {
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
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
        type: DataTypes.DECIMAL,
        allowNull: false,
    },
});

export default Delivery;