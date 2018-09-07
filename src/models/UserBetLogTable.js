import {connection, Sequelize} from './index';

const UserBetLogTable = connection.define('user-bet-logs', {
    gameId: {
        type: Sequelize.INTEGER,
    },
    userId: {
        type: Sequelize.INTEGER,
    },
    manualInvest: {
        type: Sequelize.DECIMAL(20, 18),
    },
    lastInvestedAt: {
        type: Sequelize.DATE,
    },
    status: {
        type: Sequelize.STRING,
    },
    comment: {
        type: Sequelize.STRING,
    }
});

export default UserBetLogTable;
