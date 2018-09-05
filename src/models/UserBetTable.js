import {connection, Sequelize} from './index';

const UserBetTable = connection.define('v-user-bets', {
    gameId: {
        type: Sequelize.INTEGER,
    },
    userId: {
        type: Sequelize.INTEGER,
    },
    userBalance: {
        type: Sequelize.BIGINT,
    },
    userInviteCode: {
        type: Sequelize.STRING,
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
    lastInvestedAt: {
        type: Sequelize.DATE,
    }
});

export default UserBetTable;
