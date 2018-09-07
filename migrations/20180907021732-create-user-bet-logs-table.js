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
    return db.createTable('user-bet-logs', {
        id: {
            type: 'int',
            primaryKey: true,
            autoIncrement: true,
        },
        userId: {
            type: 'int',
            notNull: true,
            foreignKey: {
                name: 'user_bet_logs_user_id_fk',
                table: 'users',
                rules: {
                    onDelete: 'CASCADE',
                    onUpdate: 'CASCADE',
                },
                mapping: 'id',
            }
        },
        gameId: {
            type: 'int',
            notNull: true,
            foreignKey: {
                name: 'user_bet_logs_game_id_fk',
                table: 'games',
                rules: {
                    onDelete: 'CASCADE',
                    onUpdate: 'CASCADE',
                },
                mapping: 'id',
            }
        },
        manualInvest: {
            type: 'decimal',
            length: '20, 18',
            defaultValue: 0,
        } ,
        lastInvestedAt: {
            type: 'timestamp',
        },
        status: {
            type: 'string',
            length: 256,
        },
        comment: {
            type: 'string',
            length: 1024,
            defaultValue: 'NO COMMENT',
        },
        createdAt: {
            type: 'timestamp',
        },
        updatedAt: {
            type: 'timestamp',
        }
    })
    .then(() => {
        return db.addIndex('user-bet-logs', 'user-id', ['userId']);
    });
};

exports.down = function(db) {
    return db.dropTable('user-bet-logs');
};

exports._meta = {
    "version": 1
};
