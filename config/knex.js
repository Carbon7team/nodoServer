module.exports = require('knex')({
    client: 'pg',
    //version: '7.2',
    connection: {
      host : '127.0.0.1',
      port : 5432,
      user :"postgres",
      password: "root",
      database : "socomec"
    }
});