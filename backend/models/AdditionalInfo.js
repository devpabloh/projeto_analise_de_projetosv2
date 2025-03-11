import { DataTypes } from "sequelize"; 
import sequelize from "../config/database.js"; 

const AdditionalInfo = sequelize.define('AdditionalInfo', {
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
    challengesFaced: {
        type: DataTypes.TEXT
    },
    identifiedRisks: {
        type: DataTypes.TEXT
    },
    additionalComments: {
        type: DataTypes.TEXT
    }
})

export default AdditionalInfo