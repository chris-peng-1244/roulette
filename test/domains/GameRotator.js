const chai = require('chai');
chai.should();

const Game = require("../../lib/domains/Game").default;
const GameStatus = require("../../lib/domains/GameStatus").default;
const UserBet = require("../../lib/domains/UserBet").default;
const User = require("../../lib/domains/User").default;
const GameRotator = require("../../lib/domains/GameRotator").default;
const AssetCalculator = require("../../lib/domains/AssetCalculator").default;

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
        const betA = UserBet.make(game, userA, 20);
        const betB = UserBet.make(game, userB, 10);
        userA.balance.should.equal(0);
        userB.balance.should.equal(0);
        betA.manualInvest.should.equal(20);
        betA.reward.should.equal(2);
        betB.manualInvest.should.equal(10);
        betB.reward.should.equal(1);
        game.addUserBet(betA);
        game.addUserBet(betB);

        const rotator = new GameRotator(null, game);
        const newRound = rotator.rotate();
        newRound.status.should.equal(GameStatus.STARTED);
        newRound.round.should.equal(1);
        newRound.goal.should.equal(50);
        game.status.should.equal(GameStatus.FAIL_AT_ITS_OWN_ROUND);

        const assetCal = new AssetCalculator(null, game);
        assetCal.calculateAfterARound();
        userA.balance.should.equal(20);
        userB.balance.should.equal(10);
    });

    it("It should return bet to user's balance when the second round fails", () => {
        const game = new Game();
        game.round = 1;
        game.status = GameStatus.STARTED;
        game.goal = 50;
        game.deadline = new Date();
        const betA = UserBet.make(game, userA, 20);
        const betB = UserBet.make(game, userB, 10);
        const betC = UserBet.make(game, userC, 20);
        game.addUserBet(betA);
        game.addUserBet(betB);
        game.addUserBet(betC);
        userA.balance.should.equal(0);
        userB.balance.should.equal(0);
        betA.manualInvest.should.equal(20);
        betA.reward.should.equal(2);
        betB.manualInvest.should.equal(10);
        betB.reward.should.equal(1);
        betC.reward.should.equal(7);

        const rotator = new GameRotator(null, game);
        const newRound = rotator.rotate();
        newRound.status.should.equal(GameStatus.STARTED);
        newRound.round.should.equal(2);
        newRound.goal.should.equal(79);
        game.status.should.equal(GameStatus.PENDING_FOR_NEXT_ROUND);
        //
        // const assetCal = new AssetCalculator(null, game);
        // assetCal.calculateAfterARound();
        // userA.balance.should.equal(20);
        // userB.balance.should.equal(10);
    });
});
