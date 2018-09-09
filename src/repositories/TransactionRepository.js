// @flow
import Transaction from "../domains/Transaction";
import TransactionTable from '../models/TransactionTable';
import {fromWei} from '../utils/eth-units';
import logger from '../logger';

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
}

export default TransactionRepository;
