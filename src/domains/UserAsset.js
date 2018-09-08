// @flow
class UserAsset {
    // Balance can be withdraw
    balance: number;
    // Locked in the game
    locked: number;


    constructor(balance: number, locked: number) {
        this.balance = balance;
        this.locked = locked;
    }
}

export default UserAsset;
