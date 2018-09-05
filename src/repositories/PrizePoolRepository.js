// @flow
import PrizePool from "../domains/PrizePool";
import redis from '../redis';

const PRIZE_POOL = 'prize-pool';
class PrizePoolRepository {
    async getPrizePool(): Promise<PrizePool> {
        const pool = PrizePool.getInstance();
        const data = await redis.getAsync(PRIZE_POOL);
        if (data) {
            pool.total = data;
        }
        return pool;
    }

    async savePrizePool(prizePool: PrizePool) {
        await redis.setAsync(PRIZE_POOL, prizePool.total);
    }
}

export default PrizePoolRepository;
