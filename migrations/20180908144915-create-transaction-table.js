'use strict';

var dbm;
var type;
var seed;

/**
 * We receive the dbmigrate dependency from dbmigrate initially.
 * This enables us to not have to rely on NODE_PATH.
 */
exports.setup = function(options, seedLink) {
    dbm = options.dbmigrate;
    type = dbm.dataType;
    seed = seedLink;
};

exports.up = function(db) {
    return db.createTable('user-balance-logs', {
        id: {
            type: 'int',
            primaryKey: true,
            autoIncrement: true,
        },
        userId: {
            type: 'int',
            notNull: true,
            foreignKey: {
                name: 'user_balance_logs_user_id_fk',
                table: 'users',
                rules: {
                    onDelete: 'CASCADE',
                    onUpdate: 'NO ACTION',
                },
                mapping: 'id',
            }
        },
        value: {
            type: 'decimal',
            length: '23, 18',
            unsigned: true,
        },
        type: {
            type: 'string',
        },
        createdAt: {
            type: 'datetime',
        },
        updatedAt: {
            type: 'datetime'
        }
    });
};

exports.down = function(db) {
    return db.dropTable('user-balance-logs');
};

exports._meta = {
    "version": 1
};
