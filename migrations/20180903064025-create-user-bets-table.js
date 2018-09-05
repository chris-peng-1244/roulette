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
    return db.createTable('user-bets', {
        id: {
            type: 'int',
            primaryKey: true,
            autoIncrement: true,
        },
        userId: {
            type: 'int',
        },
        gameId: {
            type: 'int',
        },
        reward: {
            type: 'bigint',
        },
        autoInvest: {
            type: 'bigint',
        },
        manualInvest: {
            type: 'bigint',
        } ,
        lastInvestedAt: {
            type: 'timestamp',
        },
        createdAt: {
            type: 'timestamp',
        },
        updatedAt: {
            type: 'timestamp',
        }
   })
    .then(() => {
        return db.addIndex('user-bets', 'gameId-userId', ['gameId', 'userId'], true);
    })
    .then(() => {
        return db.addIndex('user-bets', 'updatedAt', ['updatedAt']);
    });
};

exports.down = function(db) {
    return db.dropTable('user-bets');
};

exports._meta = {
    "version": 1
};
