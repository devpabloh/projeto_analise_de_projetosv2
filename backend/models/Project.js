import {DataTypes} from "sequelize"; 
import sequelize from "../config/database.js"; 

const Project = sequelize.define('Project', {
    id: {
        type: DataTypes.INTEGER, 
        primaryKey: true, 
        autoIncrement: true
    },
    userId: {
        type: DataTypes.INTEGER,
        references: {
            model: 'users',
            key: 'id'
        }
    },
    projectName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    projectDescription: {
        type: DataTypes.TEXT
    },
    responsibleFillingOut: {
        type: DataTypes.STRING,
        allowNull: false
    },
    responsibleContact: {
        type: DataTypes.STRING,
        allowNull: false
    },
    fillingDate: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    developmentPhase: {
        type: DataTypes.STRING
    },
    carriedOutTests: {
        type: DataTypes.STRING
    },
    selectedTests: {
        type: DataTypes.JSON 
    },
    otherTestsDescription: {
        type: DataTypes.TEXT
    },
    frequencyAndAutomation: {
        type: DataTypes.STRING
    },
    testingToolsUsed: {
        type: DataTypes.TEXT
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
    },
    hasDocumentation: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    documentationType: {
        type: DataTypes.STRING
    }
})

export default Project; 