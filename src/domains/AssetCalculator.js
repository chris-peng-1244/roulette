// @flow
import Game from "./Game";
import GameStatus from "./GameStatus";
import _ from 'lodash';

class AssetCalculator {
    previousGame: Game | null;
    currentGame: Game;


    constructor(previousGame: Game | null, currentGame: Game) {
        this.previousGame = previousGame;
        this.currentGame = currentGame;
    }

    calculateAfterARound() {
        if (this.previousGame === null && this.currentGame.status === GameStatus.FAIL_AT_ITS_OWN_ROUND) {
            _.forEach(this.currentGame.userBetList, userBet => {
                userBet.user.balance += userBet.manualInvest;
            });
        }
    }
}

export default AssetCalculator;
