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

    getValueChange() {
        if (this.type === TransactionType.BET) {
            return -1 * this.value;
        }
        return this.value;
    }

    static createRefundTransaction(user: User, value: number, createdAt: Date = new Date()): Transaction {
        return new Transaction(user, TransactionType.REFUND, createdAt, value);
    }

    static createRewardTransaction(user: User, value: number, createdAt: Date = new Date()): Transaction {
        return new Transaction(user, TransactionType.REWARD, createdAt, value);
    }

    static createBetTransaction(user: User, value: number, createdAt: Date = new Date()): Transaction {
        return new Transaction(user, TransactionType.BET, createdAt, value);
    }
}

export default Transaction;
