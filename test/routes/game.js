const {agent} = require('./index');
const {clearGameData, spawnGameData} = require('./test-data');

describe("API /game", () => {
    beforeEach(async() => {
        await clearGameData();
    });

    it("It should return error when there is no game", async() => {
        const res = await agent.get('/game');
        const error = res.body.error;
        error.message.should.equal('No game is undertaking');
    });

    it("It should return the current game", async() => {
        await spawnGameData();

        const res = await agent.get('/game');
        const result = res.body;
        result.pool.should.equal('11');
        result.goal.should.equal('50');
    });
});
