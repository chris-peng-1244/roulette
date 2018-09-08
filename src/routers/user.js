// @flow
import express from 'express';
import {createUserAssetRepository} from "../repositories/RepositoryFactory";
import {fromWei} from '../utils/eth-units';

const router = express.Router();

router.get('/assets', async (req, res, next) => {
    const asset = await createUserAssetRepository().getUserAsset(req.app.get('user'));
    return res.json({
        balance: fromWei(asset.balance),
        locked: fromWei(asset.locked),
    });
});

export default router;
