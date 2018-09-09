// @flow

class User {
    id: number;
    balance: number;
    inviteCode: string;
    address: string;
    constructor(id: number, balance: number, inviteCode: string = '', address: string = '') {
        this.id = id;
        this.balance = balance;
        this.address = address;
        this.inviteCode = inviteCode;
    }
}

export default User;
