// @flow
import PrizePool from "../domains/PrizePool";
import redis from '../redis';
import {fromWei, toWei} from '../utils/eth-units';

const PRIZE_POOL = 'prize-pool';
class PrizePoolRepository {
    async getPrizePool(): Promise<PrizePool> {
        const pool = PrizePool.getInstance();
        const data = await redis.getAsync(PRIZE_POOL);
        if (data) {
            pool.total = toWei(data);
        }
        return pool;
    }

    async savePrizePool(prizePool: PrizePool) {
        await redis.setAsync(PRIZE_POOL, fromWei(prizePool.total));
    }

    async incrPrizePool(amount: number) {
        await redis.incrbyAsync(PRIZE_POOL, fromWei(amount));
    }
}

export default PrizePoolRepository;
