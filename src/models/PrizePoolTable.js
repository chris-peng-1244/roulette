import {connection, Sequelize} from './index';

const PrizePoolTable = connection.define('prize-pool', {
    total: {
        type: Sequelize.BIGINT,
    },
});

export default PrizePoolTable;
