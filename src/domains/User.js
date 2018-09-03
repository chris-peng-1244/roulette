// @flow
import Game from "./Game";
import UserBet from "./UserBet";

class User {
    id: number;
    balance: number;
    constructor(id: number, balance: number) {
        this.id = id;
        this.balance = balance;
    }

    makeBet(game: Game, amount: number) {
        return new UserBet();
    }
}

export default User;
