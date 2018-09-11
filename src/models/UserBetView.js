import {connection, Sequelize} from './index';

const UserBetView = connection.define('v-user-bets', {
    gameId: {
        type: Sequelize.INTEGER,
    },
    userId: {
        type: Sequelize.INTEGER,
    },
    userBalance: {
        type: Sequelize.DECIMAL(23, 18),
    },
    userInviteCode: {
        type: Sequelize.STRING,
    },
    userInviterId: {
        type: Sequelize.INTEGER,
    },
    reward: {
        type: Sequelize.DECIMAL(20, 18),
    },
    autoInvest: {
        type: Sequelize.DECIMAL(19, 18),
    },
    manualInvest: {
        type: Sequelize.DECIMAL(20, 18),
    },
    lastInvestedAt: {
        type: Sequelize.DATE,
    }
});

export default UserBetView;
