// @flow
import User from "./User";

class Transaction {
    user: User;
    type: string;
    createdTime: Date;
    value: number;
}

export default Transaction;
