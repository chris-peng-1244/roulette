// @flow

class User {
    id: number;
    mobile: string;
    balance: number;
    inviteCode: string;
    address: string;
    inviterId: number;
    constructor(
        id: number,
        balance: number,
        inviteCode: string = '',
        address: string = '',
        inviterId: number = 0,
        mobile: string = '') {
        this.id = id;
        this.balance = balance;
        this.address = address;
        this.inviteCode = inviteCode;
        this.inviterId = inviterId;
        this.mobile = mobile;
    }

    static createBlankUser(id: number): User {
        return new User(id, 0);
    }
}

export default User;
