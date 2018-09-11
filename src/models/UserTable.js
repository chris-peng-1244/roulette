// @flow
import {connection, Sequelize} from './index';

const UserTable = connection.define('users', {
    mobile:{
        type: Sequelize.STRING,
        unique: true,
    },
    inviteCode: {
        type: Sequelize.STRING,
        unique: true
    },
    balance: {
        type: Sequelize.DECIMAL(23, 18),
    },
    inviterId: {
        type: Sequelize.STRING,
    }
});

export default UserTable;
