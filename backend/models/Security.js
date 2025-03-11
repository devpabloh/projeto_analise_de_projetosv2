import {DataTypes} from "sequelize";
import sequelize from "../config/database.js"

const Security = sequelize.define('Security', {
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
    securityMeasures: {
        type: DataTypes.BOOLEAN
    },
    whatSecurityMeasures: {
        type: DataTypes.TEXT
    },
    otherSecurityMeasures: {
        type: DataTypes.TEXT
    },
    compliance: {
        type: DataTypes.BOOLEAN
    },
    whatCompliance: {
        type: DataTypes.TEXT
    },
    otherCompliance: {
        type: DataTypes.TEXT
    }
})

export default Security;