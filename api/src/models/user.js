const { DataTypes } = require('sequelize');

module.exports = function(sequelize) {
    const user = sequelize.define('users', {
            no: {
                primaryKey: true,
                type: DataTypes.INTEGER,
                autoIncrement: true,
                allowNull: false,
            },
            userId: {
                type: DataTypes.STRING(20),
                allowNull: false,
                unique: true,
            },
            userName: {
                type: DataTypes.STRING(20),
                allowNull: false,
                unique: true,
            },
            userEmail: {
                type: DataTypes.STRING,
                unique: true,
                allowNull: false,
                validate:{
                    isEmail : true
                }
            },
            userPassword: {
                type: DataTypes.STRING(255),
                allowNull: false,
            },
            userPhoneNumber: {
                type: DataTypes.STRING(13),
                allowNull: false,
                unique: true,
            },
            salt: {
                type: DataTypes.STRING(255),
                allowNull: false,
            },
            regDtt: {
                type: DataTypes.DATE,
                allowNull: false,
            },
            modDtt: {
                type: DataTypes.DATE,
                allowNull: false,
            },
        },
        {
            sequelize,
            timestamps: false,
            underscored: false,
            modelName: 'User',
            tableName: 'users',
            paranoid: false,
            charset: 'utf8',
            collate: 'utf8_general_ci',
        },
    );
    return user;
}