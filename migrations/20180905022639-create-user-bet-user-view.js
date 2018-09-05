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
  return db.runSql(
      `CREATE VIEW \`v-user-bets\` AS SELECT \`user-bets\`.*, users.balance AS userBalance, users.inviteCode AS userInviteCode
      FROM \`user-bets\` INNER JOIN users
      ON \`user-bets\`.userId = users.id`
  );
};

exports.down = function(db) {
  return db.runSql(
      'DROP VIEW `v-user-bets`'
  );
};

exports._meta = {
  "version": 1
};
