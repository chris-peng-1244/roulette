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
        `CREATE VIEW \`v-user-invite-reward-logs\` 
          AS SELECT \`logs\`.*, 
          invitee.mobile as inviteeMobile, inviter.mobile as inviterMobile
          FROM \`user-invite-reward-logs\` AS logs 
          INNER JOIN users as invitee ON logs.inviteeId = invitee.id
          INNER JOIN users as inviter ON logs.inviterId = inviter.id
      `
    );
};

exports.down = function(db) {
    return db.runSql('DROP VIEW `v-user-invite-reward-logs`');
};

exports._meta = {
    "version": 1
};
