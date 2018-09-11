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
    return db.addColumn('users', 'inviterId', {
        type: 'int',
        foreignKey: {
            name: 'user_inviter_fk',
            table: 'users',
            rules: {
                onDelete: 'SET NULL',
                onUpdate: 'NO ACTION',
            },
            mapping: 'id',
        }
    });
};

exports.down = function(db) {
    return db
        .removeForeignKey('users', 'user_inviter_fk')
        .then(() => {
            return db.removeColumn('users', 'inviterId');
        });
};

exports._meta = {
    "version": 1
};
