import { DataTypes } from "sequelize"; 
import sequelize from "../config/database.js";

const Environment = sequelize.define('Environment', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    projectId: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Projects',
            key: 'id'
        }
    },
    developmentEnvironment: {
        type: DataTypes.STRING
    },
    approvalEnvironment: {
        type: DataTypes.STRING
    },
    productionEnvironment: {
        type: DataTypes.STRING
    },
    deploymentEnvironmentNotes: {
        type: DataTypes.TEXT
    }
})

export default Environment;
