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
    return db.createTable('games', {
        id: {
            type: 'int',
            primaryKey: true,
            autoIncrement: true,
        },
        round: {
            type: 'int'
        },
        beginAt: {
            type: 'datetime',
        },
        deadline: {
            type: 'datetime',
        },
        status: {
            type: 'string',
        },
        goal: {
            type: 'bigint'
        },
        createdAt: {
            type: 'datetime'
        },
        updatedAt: {
            type: 'datetime'
        },
    })
    .then(() => {
        return db.addIndex('games', 'beginAt', ['beginAt']);
    });
};

exports.down = function(db) {
    return db.dropTable('games');
};

exports._meta = {
    "version": 1
};
