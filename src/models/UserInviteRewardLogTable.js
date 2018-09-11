// @flow
import {connection, Sequelize} from './index';

const UserInviteRewardLogTable = connection.define('user-invite-reward-logs', {
    inviterId:{
        type: Sequelize.INTEGER,
    },
    inviteeId: {
        type: Sequelize.INTEGER,
    },
    gameId: {
        type: Sequelize.INTEGER,
    },
    reward: {
        type: Sequelize.DECIMAL(19, 18),
    }
});

export default UserInviteRewardLogTable;
