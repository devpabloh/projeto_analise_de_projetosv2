import { DataTypes } from "sequelize"; 
import sequelize from "../config/database.js";


const User = sequelize.define('user', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: {type: DataTypes.STRING, allowNull: false}, 
    email: {type: DataTypes.STRING, unique: true, allowNull: false},
    password: {type: DataTypes.STRING, allowNull: false},
    role: {type: DataTypes.ENUM('common', 'admin'), defaultValue: 'common' }
});

export default User;
