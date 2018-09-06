const {agent} = require('./index');
const GameTable = require('../../lib/models/GameTable').default;
const GameStatus = require("../../lib/domains/GameStatus").default;
const UserTable = require("../../lib/models/UserTable").default;
const UserBetTable = require("../../lib/models/UserBetTable").default;

describe("API /game", () => {
    beforeEach(async() => {
        await Promise.all([
            GameTable.destroy({truncate: true}),
            UserTable.destroy({truncate: true}),
            UserBetTable.destroy({truncate: true}),
        ]);
    });

    it("It should return error when there is no game", async() => {
        const res = await agent.get('/game');
        const error = res.body.error;
        error.message.should.equal('No game is undertaking');
    });

    it("It should return the current game", async() => {
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

        const res = await agent.get('/game');
        const result = res.body;
        result.pool.should.equal('11');
        result.goal.should.equal('50');
    });
});
