import { DataTypes } from "sequelize";
import db from "../config/db.js";

const ElementCategory = db.define('element_subcategory', {
    id: {
        type: DataTypes.INTEGER.ZEROFILL,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    }
}, {});

export default ElementCategory;