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
        type: Sequelize.BIGINT,
    }
});

export default UserTable;
