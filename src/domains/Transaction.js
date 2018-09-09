// @flow
import User from "./User";
import TransactionType from "./TransactionType";

class Transaction {
    user: User;
    type: string;
    createdAt: Date;
    value: number;


    constructor(user: User, type: string, createdAt: Date, value: number) {
        this.user = user;
        this.type = type;
        this.createdAt = createdAt;
        this.value = value;
    }

    static createRefundTransaction(user: User, value: number, createdAt: Date = new Date()): Transaction {
        return new Transaction(user, TransactionType.REFUND, createdAt, value);
    }

    static createBetTransaction(user: User, value: number, createdAt: Date = new Date()): Transaction {
        return new Transaction(user, TransactionType.BET, createdAt, value);
    }
}

export default Transaction;
