import express from 'express';
import {fromWei} from '../utils/eth-units';
import {format} from '../utils/ch-datetime';

const router = express.Router();

router.get('/', async(req, res, next) => {
    const transactions = await txRepo.findAllByUser(req.app.get('user'));
    return res.json(transactions.map(transaction => {
        return {
            createdTime: format(transaction.createdAt),
            value: fromWei(transaction.value),
            type: transaction.type,
        };
    }));
});

export default router;
