// @flow
import {connection, Sequelize} from './index';

const GameTable = connection.define('games', {
    round:{
        type: Sequelize.INT,
        unique: true,
    },
    beginAt: {
        type: Sequelize.TIMESTAMP,
        unique: true
    },
    deadline: {
        type: Sequelize.TIMESTAMP,
    },
    status: {
        type: Sequelize.STRING,
    },
    goal: {
        type: Sequelize.INT,
    }
});

export default GameTable;
