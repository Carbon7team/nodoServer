/* eslint-disable indent */
/**
 * @swagger
 * definitions:
 *   User:
 *     type: object
 *     properties:
 *       id:
 *         type: integer
 *       first_name:
 *         type: string
 *       last_name:
 *         type: string
 *       email:
 *         type: string
 *       username:
 *         type: string
 *       password:
 *         type: string
 *         format: password
 *       required:
 *         - email
 *         - username
 *         - password
 */

 module.exports = function(sequelize, DataTypes) {
    // return queryInterface.sequelize.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";').then(()=>{
      return sequelize.define('UserOnline', {
        id: {
          type: DataTypes.UUID,
          primaryKey: true,
          defaultValue: DataTypes.UUIDV4,
        },
        user_id : {
          type: DataTypes.UUID,
              allowNull: false,
              references: { model: 'User', key: 'id'},
              onUpdate: 'CASCADE',
              onDelete: 'CASCADE'
        }, 
        disponibility:{
          type: DataTypes.BOOLEAN,
          defaultValue: false,
          allowNull: false,
        },
        id_socket: {
          type: DataTypes.STRING,
          allowNull: false,
        }
      }, {
          tableName: 'UserOnline'
    });
  //  });
  };
  
  