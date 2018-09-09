// @flow
import Transaction from "../domains/Transaction";
import TransactionTable from '../models/TransactionTable';
import {fromWei, toWei} from '../utils/eth-units';
import logger from '../logger';
import User from "../domains/User";

class TransactionRepository {
    async createTransaction(tx: Transaction): Promise<boolean> {
        try {
            await TransactionTable.create({
                userId: tx.user.id,
                value: fromWei(tx.value),
                type: tx.type,
            });
            return true;
        } catch (e) {
            logger.error('[TransactionRepository] createTransaction error ' + e.stack);
            return false;
        }
    }

    async findAllByUser(user: User): Promise<Transaction[]> {
        const data = await TransactionTable.findAll({
            where: {userId: user.id},
        });
        if (!data) {
            return [];
        }
        return data.map(value => {
            return new Transaction(user, value.type, data.createdAt, toWei(value.value));
        });
    }
}

export default TransactionRepository;
