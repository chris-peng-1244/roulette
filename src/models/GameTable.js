// @flow
import {connection, Sequelize} from './index';

const GameTable = connection.define('games', {
    round:{
        type: Sequelize.INTEGER,
        unique: true,
    },
    beginAt: {
        type: Sequelize.DATE,
        unique: true
    },
    deadline: {
        type: Sequelize.DATE,
    },
    status: {
        type: Sequelize.STRING,
    },
    goal: {
        type: Sequelize.DECIMAL(23, 18),
    },
    previousGameId: {
        type: Sequelize.INTEGER,
    }
});

export default GameTable;
