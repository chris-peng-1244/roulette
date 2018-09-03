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
            type: 'timestamp',
        },
        deadline: {
            type: 'timestamp',
        },
        status: {
            type: 'string',
        },
        goal: {
            type: 'bigint'
        },
        createdAt: {
            type: 'timestamp'
        },
        updatedAt: {
            type: 'timestamp'
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
