const {agent} = require('./index');
const User = require('../../lib/models/UserTable').default;

const mobile = 12344445555;
describe("Login", () => {
    before(async() => {
        await User.destroy({where: {}});
    });

    it("It should login and create new user", async() => {
        const res = await agent.post('/login')
            .type('application/json')
            .send({mobile});

        res.body.token.should.not.be.null;
        const userCount = await User.count({where:{mobile}});
        userCount.should.equal(1);
    });

    it("It should just login", async() => {
        await agent.post('/login')
            .type('application/json')
            .send({mobile});
        const userCount = await User.count({where:{mobile}});
        userCount.should.equal(1);
    });
});
