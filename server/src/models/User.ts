import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database.js';

interface UserAttributes {
    id: number;
    hash: string;
}

interface UserCreationAttributes extends Optional<UserAttributes, 'id'> {}

class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
    public declare id: number;
    public declare hash: string;
}

User.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    hash: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    tableName: 'users',
    timestamps: false,
    sequelize,
});

export default User;