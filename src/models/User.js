// @flow
import {connection, Sequelize} from './index';

const User = connection.define('users', {
    mobile:{
        type: Sequelize.STRING,
        unique: true,
    },
    inviteCode: {
        type: Sequelize.STRING,
        unique: true
    },
});

export default User;
