process.env.MYSQL_DATABASE="casino_test";

const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
const app = require('../../lib/index').default;
chai.use(chaiHttp);
const agent = chai.request.agent(app);

exports.agent = agent;
exports.login = async function(agent) {
    const res = await agent.post('/login')
        .type('application/json')
        .send({
            mobile: 11122223333
        });
    return res.body.token;
};

