// @flow

class User {
    id: number;
    balance: number;
    inviteCode: string;
    address: string;
    inviterId: User;
    constructor(id: number, balance: number, inviteCode: string = '', address: string = '', inviterId: number = 0) {
        this.id = id;
        this.balance = balance;
        this.address = address;
        this.inviteCode = inviteCode;
        this.inviterId = inviterId;
    }
}

export default User;
