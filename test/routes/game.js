const {agent} = require('./index');

describe("API /game", () => {
    it("It should return error when there is no game", async() => {
        const res = await agent.get('/game');
        const error = res.body.error;
        error.message.should.equal('No game is undertaking');
    });

    it("It should return the current game", async() => {

    });
});
