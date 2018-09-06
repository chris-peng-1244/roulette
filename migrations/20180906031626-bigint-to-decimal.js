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
    return db.changeColumn('games', 'goal', {
        type: 'decimal',
        length: '23, 18'
    })
        .then(() => {
            db.changeColumn('users', 'balance', {
                type: 'decimal',
                length: '23, 18',
            })
        })
        .then(() => {
            db.changeColumn('user-bets', 'autoInvest', {
                type: 'decimal',
                length: '19, 18',
            })
        })
        .then(() => {
            db.changeColumn('user-bets', 'manualInvest', {
                type: 'decimal',
                length: '20, 18',
            })
        })
        .then(() => {
            db.changeColumn('user-bets', 'reward', {
                type: 'decimal',
                length: '20, 18',
            })
        });
};

exports.down = function(db) {
    return db.changeColumn('games', 'goal', {
        type: 'bigint',
    })
        .then(() => {
            db.changeColumn('users', 'balance', {
                type: 'bigint',
            })
        })
        .then(() => {
            db.changeColumn('user-bets', 'autoInvest', {
                type: 'bigint',
            })
        })
        .then(() => {
            db.changeColumn('user-bets', 'manualInvest', {
                type: 'bigint',
            })
        })
        .then(() => {
            db.changeColumn('user-bets', 'reward', {
                type: 'bigint',
            })
        });
};

exports._meta = {
    "version": 1
};
