import { DataTypes } from "sequelize"; 
import sequelize from "../config/database.js"; 

const Test = sequelize.define('Test', {
    id: { 
        type: DataTypes.INTEGER, 
        primaryKey: true, 
        autoIncrement: true
    },
    projectId: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Projects',
            key: 'id'
        }
    },
    carriedOutTests: {
        type: DataTypes.STRING
    },
    selectedTests: {
        type: DataTypes.JSON,  
        defaultValue: []
    },
    otherTestsDescription: {
        type: DataTypes.TEXT
    },
    frequencyAndAutomation: {
        type: DataTypes.STRING
    },
    testingToolsUsed: {
        type: DataTypes.TEXT
    }
})

export default Test;