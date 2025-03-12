import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const History = sequelize.define('History', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    actionType: {
        type: DataTypes.ENUM('CREATE', 'UPDATE', 'DELETE'),
        allowNull: false
    },
    entityType: {
        type: DataTypes.ENUM('PROJECT', 'USER'),
        allowNull: false
    },
    entityId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    details: {
        type: DataTypes.JSON,
        allowNull: false
    }
});

export default History;