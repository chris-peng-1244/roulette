const chai = require('chai');
chai.should();

import Game from "../../src/domains/Game";
import GameStatus from "../../src/domains/GameStatus";
import UserBet from "../../src/domains/UserBet";
import User from "../../src/domains/User";
import GameRotator from "../../src/domains/GameRotator";

let userA, userB, userC;

describe("GameTable rotator", () => {
    before(() => {
        userA = new User(1, 20);
        userB = new User(2, 10);
        userC = new User(3, 20);
    });

    it("It should return bet to user's balance when the first round fails", () => {
        const game = new Game();
        game.round = 1;
        game.status = GameStatus.STARTED;
        game.goal = 50;
        game.deadline = new Date();
        const betA = userA.makeBet(game, 20);
        const betB = userB.makeBet(game, 10);
        userA.balance.should.equal(0);
        userB.balance.should.equal(0);
        betA.manualInvest.should.equal(20);
        betA.reward.should.equal(2);
        betB.manualInvest.should.equal(10);
        betB.reward.should.equal(1);

        const rotator = new GameRotator(null, game);
        const newRound = rotator.rotate();
        newRound.status.should.equal(GameStatus.STARTED);
        newRound.round.should.equal(1);
        newRound.goal.should.equal(50);
        game.status.should.equal(GameStatus.FAIL_AT_ITS_OWN_ROUND);
        userA.balance.should.equal(20);
        userB.balance.should.equal(10);
    });
});
