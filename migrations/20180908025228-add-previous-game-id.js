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
    return db.addColumn('games', 'previousGameId', {
        type: 'int',
        foreignKey: {
            name: 'game_previous_game_id_fk',
            table: 'games',
            rules: {
                onDelete: 'SET NULL',
                onUpdate: 'NO ACTION',
            },
            mapping: 'id',
        }
    });
};

exports.down = function(db) {
    return db.removeColumn('games', 'previousGameId');
};

exports._meta = {
    "version": 1
};
