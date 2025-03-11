import {DataTypes} from "sequelize"; 
import sequelize from "../config/database.js"


const Documentation = sequelize.define('documentations', { 
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
    technicalDocumentation: {
        type: DataTypes.TEXT
    },
    linkTechnicalDocumentation: {
        type: DataTypes.STRING
    },
    updatingTechnicalDocumentation: {
        type: DataTypes.DATEONLY,
        allowNull: true
    },
    updateTechnicalVersion: {
        type: DataTypes.STRING,
        allowNull: true
    },
    functionalDocumentation: {
        type: DataTypes.TEXT
    },
    linkFunctionalDocumentation: {
        type: DataTypes.STRING
    },
    updatingFunctionalDocumentation: {
        type: DataTypes.DATEONLY
    },
    updateFunctionalVersion: {
        type: DataTypes.STRING
    }
})

export default Documentation;
