const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/connection");
const bcrypt = require("bcryptjs");

class User extends Model {
  checkPassword(password) { return bcrypt.compareSync(password, this.password); }
}

User.init({
  id: { type: DataTypes.INTEGER, allowNull: false, primaryKey: true, autoIncrement: true },
  username: { type: DataTypes.STRING(30), allowNull: false, unique: true, validate: { len: [3, 30] } },
  password: { type: DataTypes.STRING, allowNull: false, validate: { len: [8, 128] } },
}, {
  hooks: {
    async beforeCreate(user) { user.password = await bcrypt.hash(user.password, 10); },
    async beforeUpdate(user) { if (user.changed("password")) user.password = await bcrypt.hash(user.password, 10); },
  },
  sequelize, timestamps: false, freezeTableName: true, underscored: true, modelName: "user",
});
module.exports = User;