import express from 'express';
import {fromWei} from '../utils/eth-units';
import {format} from '../utils/ch-datetime';
import {createTransactionRepository} from "../repositories/RepositoryFactory";

const router = express.Router();
const txRepo = createTransactionRepository();
router.get('/', async(req, res, next) => {
    const transactions = await txRepo.findAllByUser(req.app.get('user'));
    return res.json(transactions.map(transaction => {
        return {
            createdTime: format(transaction.createdAt),
            amount: fromWei(transaction.getValueChange()),
            type: transaction.type,
        };
    }));
});

export default router;
