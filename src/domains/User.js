// @flow

class User {
    id: number;
    balance: number;
    inviteCode: string;
    constructor(id: number, balance: number, inviteCode: string = '') {
        this.id = id;
        this.balance = balance;
        this.inviteCode = inviteCode;
    }
}

export default User;
