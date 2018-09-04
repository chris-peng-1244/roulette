const chai = require('chai');
const should = chai.should();

const Game = require("../../lib/domains/Game").default;
const GameStatus = require("../../lib/domains/GameStatus").default;
const UserBet = require("../../lib/domains/UserBet").default;
const User = require("../../lib/domains/User").default;
const GameRotator = require("../../lib/domains/GameRotator").default;

let userA, userB, userC;

describe("GameTable rotator", () => {
    beforeEach(() => {
        userA = new User(1, 20000000000000000000);
        userB = new User(2, 10000000000000000000);
        userC = new User(3, 20000000000000000000);
    });

    it("It should return bet to user's balance when the first round fails", () => {
        const game = new Game();
        game.round = 1;
        game.status = GameStatus.STARTED;
        game.goal = 50000000000000000000;
        game.deadline = new Date();
        const betA = UserBet.makeManualBet(game, userA, 20000000000000000000);
        const betB = UserBet.makeManualBet(game, userB, 10000000000000000000);
        userA.balance.should.equal(0);
        userB.balance.should.equal(0);
        betA.manualInvest.should.equal(20000000000000000000);
        betA.reward.should.equal(2000000000000000000);
        betB.manualInvest.should.equal(10000000000000000000);
        betB.reward.should.equal(1000000000000000000);
        game.addUserBet(betA);
        game.addUserBet(betB);

        const rotator = new GameRotator(30000000000000000000, null, game);
        const newRound = rotator.rotate();
        newRound.status.should.equal(GameStatus.STARTED);
        newRound.round.should.equal(1);
        newRound.goal.should.equal(50000000000000000000);
        game.status.should.equal(GameStatus.FAIL_AT_ITS_OWN_ROUND);
        userA.balance.should.equal(20000000000000000000);
        userB.balance.should.equal(10000000000000000000);
    });

    it("It should return bet to user's balance when the second round fails", () => {
        const game = new Game();
        game.round = 1;
        game.status = GameStatus.STARTED;
        game.goal = 50000000000000000000;
        game.deadline = new Date();
        const betA = UserBet.makeManualBet(game, userA, 20000000000000000000);
        const betB = UserBet.makeManualBet(game, userB, 10000000000000000000);
        const betC = UserBet.makeManualBet(game, userC, 20000000000000000000);
        game.addUserBet(betA);
        game.addUserBet(betB);
        game.addUserBet(betC);
        userA.balance.should.equal(0);
        userB.balance.should.equal(0);
        betA.manualInvest.should.equal(20000000000000000000);
        betA.reward.should.equal(2000000000000000000);
        betB.manualInvest.should.equal(10000000000000000000);
        betB.reward.should.equal(1000000000000000000);
        betC.reward.should.equal(7000000000000000000);

        const rotator = new GameRotator(50000000000000000000, null, game);
        const newRound = rotator.rotate();
        newRound.status.should.equal(GameStatus.STARTED);
        newRound.round.should.equal(2);
        newRound.goal.should.equal(79000000000000000000);
        game.status.should.equal(GameStatus.PENDING_FOR_NEXT_ROUND);
        game.userBetList[userA.id].manualInvest.should.equal(19000000000000000000);
        game.userBetList[userB.id].manualInvest.should.equal(9500000000000000000);
        game.userBetList[userC.id].manualInvest.should.equal(19000000000000000000);
        newRound.userBetList[userA.id].autoInvest.should.equal(1000000000000000000);
        newRound.userBetList[userB.id].autoInvest.should.equal(500000000000000000);
        newRound.userBetList[userC.id].autoInvest.should.equal(1000000000000000000);

        userA.balance += 10000000000000000000;
        userC.balance += 10000000000000000000;
        const betANew = UserBet.makeManualBet(newRound, userA, 10000000000000000000);
        const betCNew = UserBet.makeManualBet(newRound, userC, 10000000000000000000);
        newRound.addUserBet(betANew);
        newRound.addUserBet(betCNew);
        const rotator2 = new GameRotator(70000000000000000000, game, newRound);
        const anotherNewRound = rotator2.rotate();
        anotherNewRound.round.should.equal(1);
        anotherNewRound.goal.should.equal(50000000000000000000);
        userA.balance.should.equal(30000000000000000000);
        userB.balance.should.equal(10000000000000000000);
        userC.balance.should.equal(30000000000000000000);
    });

    it("It should send reward when second round succeed", async() => {
        const round1 = new Game();
        round1.round = 1;
        round1.status = GameStatus.STARTED;
        round1.goal = 50000000000000000000;
        round1.deadline = new Date();
        const betA = UserBet.makeManualBet(round1, userA, 20000000000000000000);
        const betB = UserBet.makeManualBet(round1, userB, 10000000000000000000);
        const betC = UserBet.makeManualBet(round1, userC, 20000000000000000000);
        round1.addUserBet(betA);
        round1.addUserBet(betB);
        round1.addUserBet(betC);

        let rotator = new GameRotator(50000000000000000000, null, round1);
        const round2 = rotator.rotate();
        userA.balance += 30000000000000000000;
        userC.balance += 50000000000000000000;
        round2.addUserBet(UserBet.makeManualBet(round2, userC, 50000000000000000000));
        round2.addUserBet(UserBet.makeManualBet(round2, userA, 30000000000000000000));
        round2.userBetList[userA.id].lastInvestedAt = new Date(round2.userBetList[userA.id].lastInvestedAt.getTime() + 10);
        rotator = new GameRotator(110000000000000000000, round1, round2);
        const round3 = rotator.rotate();
        round1.status.should.equal(GameStatus.SUCCEED);
        round2.status.should.equal(GameStatus.PENDING_FOR_NEXT_ROUND);
        round3.status.should.equal(GameStatus.STARTED);
        userA.balance.should.equal(21000000000000000000);
        userB.balance.should.equal(10500000000000000000);
        userC.balance.should.equal(26000000000000000000);
        round2.userBetList[userC.id].manualInvest.should.equal(47500000000000000000);
        round2.userBetList[userA.id].manualInvest.should.equal(25175000000000000000);
        round3.userBetList[userC.id].autoInvest.should.equal(2500000000000000000);
        round3.userBetList[userA.id].manualInvest.should.equal(3500000000000000000);
        round3.userBetList[userA.id].autoInvest.should.equal(1325000000000000000);
        should.equal(round3.userBetList[userB.id], undefined);
    });
});
