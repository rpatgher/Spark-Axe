import { DataTypes } from "sequelize";
import db from "../config/db.js";

const Delivery = db.define('delivery', {
    envio_costo: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    envio_extra: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    distancia: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
}, {});

export default Delivery;