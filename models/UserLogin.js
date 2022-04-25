/* jshint indent: 1 */


module.exports = function(sequelize, DataTypes) {
	return sequelize.define('UserLogin', {
		id: {
			type: DataTypes.BIGINT,
			allowNull: false,
			autoIncrement: true,
			primaryKey: true
		},
		user_id : {
		  type: DataTypes.UUID,
          allowNull: false,
          references: { model: 'User', key: 'id'},
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE'
        },
		logged_out: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: false
		},
		logged_in_at: {
			type: DataTypes.DATE,
			allowNull: false,
			defaultValue: sequelize.fn('now')
		},
		logged_out_at: {
			type: DataTypes.DATE,
			allowNull: false,
			defaultValue: sequelize.fn('now')
		},
		ip_address: {
			type: DataTypes.TEXT,
			allowNull: true
		},
		token_id: {
			type: DataTypes.TEXT,
			allowNull: true
		},
		token_secret: {
			type: DataTypes.TEXT,
			allowNull: true
		},
		token_deleted: {
			type: DataTypes.BOOLEAN,
			allowNull: true,
			defaultValue: false
		},
		device: {
			type: DataTypes.TEXT,
			allowNull: true
		}
	},{
	indexes: [
	  { fields: ['user_id', 'token_id'], unique: true }
	]
  	}, {
		tableName: 'UserLogin'
	});

};
