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
    // TODO mobile should be unique index
    return db.createTable('users', {
        id: {
            type: 'int',
            primaryKey: true,
            autoIncrement: true
        },
        mobile: {
            type: 'string',
        },
        inviteCode: {
            type: 'string',
            description: '邀请码',
        },
        createdAt: {
            type: 'timestamp'
        },
        updatedAt: {
            type: 'timestamp'
        },
    });
};

exports.down = function(db) {
    return db.dropTable('users');
};

exports._meta = {
    "version": 1
};
