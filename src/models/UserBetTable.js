import {connection, Sequelize} from './index';

const UserBetTable = connection.define('user-bets', {
    gameId: {
        type: Sequelize.INT,
    },
    userId: {
        type: Sequelize.INT,
    },
    reward: {
        type: Sequelize.BIGINT,
    },
    autoInvest: {
        type: Sequelize.BIGINT,
    },
    manualInvest: {
        type: Sequelize.BIGINT,
    },
});

export default UserBetTable;
