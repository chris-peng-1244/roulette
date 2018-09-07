const GameTable = require('../../lib/models/GameTable').default;
const GameStatus = require("../../lib/domains/GameStatus").default;
const UserTable = require("../../lib/models/UserTable").default;
const UserBetTable = require("../../lib/models/UserBetTable").default;

exports.clearGameData = async() => {
    await Promise.all([
        GameTable.destroy({truncate: true}),
        UserTable.destroy({truncate: true}),
        UserBetTable.destroy({truncate: true}),
    ]);
};

exports.spawnGameData = async function() {
    const game = await GameTable.create({
        round: 1,
        goal: 50,
        status: GameStatus.STARTED,
        deadline: new Date().getTime() + 3600*24000,
    });

    const users = await Promise.all([
        UserTable.create({
            balance: 0,
            mobile: 11111111111,
            inviteCode: 1111,
        }),
        UserTable.create({
            balance: 0,
            mobile: 22222222222,
            inviteCode: 2222,
        })
    ]);
    await Promise.all([
        UserBetTable.create({
            gameId: game.id,
            userId: users[0].id,
            autoInvest: 0,
            manualInvest: 10,
            reward: 1,
            lastInvestedAt: new Date(),
        }),
        UserBetTable.create({
            gameId: game.id,
            userId: users[1].id,
            autoInvest: 0,
            manualInvest: 1,
            reward: 0.1,
            lastInvestedAt: new Date(),
        }),
    ]);
};
