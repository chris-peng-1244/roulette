// @flow

let inst;
class PrizePool {
    total: number;

    constructor() {
        this.total = 0;
    }

    static getInstance() {
        if (!inst) {
            inst = new PrizePool();
        }
        return inst;
    }
}

export default PrizePool;
