import { DataTypes} from "sequelize";
import sequelize from "../config/database.js";

const Team = sequelize.define('Team', {
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
    technicalLeaderName: {
        type: DataTypes.STRING
    },
    projectManagerName: {
        type: DataTypes.STRING
    },
    technicalSupport: {
        type: DataTypes.STRING
    },
    supportName: {
        type: DataTypes.STRING
    },
    supportPeriod: {
        type: DataTypes.STRING
    }
})


export default Team;
