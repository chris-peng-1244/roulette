// @flow
import {connection, Sequelize} from './index';
const UserInviteRewardLogView = connection.define('v-user-invite-reward-logs', {
    inviterId: {
        type: Sequelize.INTEGER,
    },
    inviterMobile: {
        type: Sequelize.STRING,
    },
    inviteeId: {
        type: Sequelize.INTEGER,
    },
    inviteeMobile: {
        type: Sequelize.STRING,
    },
    gameId: {
        type: Sequelize.INTEGER,
    },
    reward: {
        type: Sequelize.DECIMAL(19, 18),
    },
});

export default UserInviteRewardLogView;
