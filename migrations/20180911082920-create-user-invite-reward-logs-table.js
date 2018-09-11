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
    return db.createTable('user-invite-reward-logs', {
        id: {
            type: 'int',
            primaryKey: true,
            autoIncrement: true,
        },
        inviterId: {
            type: 'int',
            foreignKey: {
                name: 'user_invite_reward_logs_user_id_fk',
                table: 'users',
                rules: {
                    onDelete: 'CASCADE',
                    onUpdate: 'NO ACTION',
                },
                mapping: 'id',
            }
        },
        inviteeId: {
            type: 'int',
            foreignKey: {
                name: 'user_invite_reward_logs_consumer_id_fk',
                table: 'users',
                rules: {
                    onDelete: 'CASCADE',
                    onUpdate: 'NO ACTION',
                },
                mapping: 'id',
            }
        },
        reward: {
            type: 'decimal',
            length: '19, 18',
        },
        createdAt: {
            type: 'datetime',
        },
        updatedAt: {
            type: 'datetime',
        }
    });
};

exports.down = function(db) {
    return db.dropTable('user-invite-reward-logs');
};

exports._meta = {
    "version": 1
};
