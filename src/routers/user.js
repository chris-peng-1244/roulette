// @flow
import express from 'express';
import {
    createTransactionRepository,
    createUserAssetRepository, createUserRepository,
    createUserWalletRepository
} from "../repositories/RepositoryFactory";
import {fromWei, toWei} from '../utils/eth-units';
import Transaction from "../domains/Transaction";
import boom from 'boom';

const router = express.Router();

router.get('/assets', async (req, res, next) => {
    const asset = await createUserAssetRepository().getUserAsset(req.app.get('user'));
    return res.json({
        balance: fromWei(asset.balance),
        locked: fromWei(asset.locked),
    });
});

router.post('/withdraw', async(req, res, next) => {
    if (!req.body.amount || req.body.amount <= 0) {
        return next(boom.badRequest('Amount cannot be empty'));
    }
    if (!req.body.to) {
        return next(boom.badRequest('Target address cannot be empty'));
    }
    const amount = toWei(req.body.amount);
    if (req.app.get('user').balance < amount) {
        return next(boom.badRequest('Not enough balance'));
    }
    const tx = Transaction.createWithdrawTransaction(req.app.get('user'), amount);
    await createTransactionRepository().createTransaction(tx);
    await createUserRepository().updateUserBalance(req.app.get('user'), -1*amount);
    await createUserWalletRepository().withdraw(req.body.to, amount);
    return res.json(req.body);
});

export default router;
