const Sequelize = require('sequelize');
const UserModel = require('./models/User');
const UserLoginModel = require('./models/UserLogin')
const BlacklistTokenModel = require('./models/BlacklistToken')
const UserOnlineModel = require('./models/UserOnline')

const sequelize = new Sequelize(process.env['DB_NAME'], process.env['DB_USER'], process.env['DB_PASSWORD'], {
  host: process.env['DB_HOST'],
  dialect:  'postgres',
  protocol: 'postgres',
  port:     process.env['DB_PORT'],
  dialectOptions: {
  },
  define: {
    timestamps: false
  },

  pool: {
      max: 20,
      min: 0,
      idle: 5000
  },
  logging:false
});

const User = UserModel(sequelize, Sequelize);
const UserLogin = UserLoginModel(sequelize, Sequelize);
const BlacklistToken = BlacklistTokenModel(sequelize, Sequelize);
const UserOnline = UserOnlineModel(sequelize, Sequelize);



User.hasMany(UserOnline, { foreignKey: 'user_id' });
UserOnline.belongsTo(User, { foreignKey: 'user_id' });

/*
db.tutorials.hasMany(db.comments, { as: "comments" });

db.comments.belongsTo(db.tutorials, {
  foreignKey: "tutorialId",
  as: "tutorial",
});*/

sequelize.sync({force: true}).then(() => {
  // eslint-disable-next-line no-console
  console.log('db and tables have been created');
});

module.exports = {User, UserLogin, BlacklistToken,UserOnline};
