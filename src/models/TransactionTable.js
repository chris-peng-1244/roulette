//@flow
import {Sequelize, connection} from './index';

const TransactionTable = connection.define('user-balance-logs', {
    userId: {
        type: Sequelize.INTEGER
    },
    value: {
        type: Sequelize.DECIMAL(23, 18)
    },
    type: {
        type: Sequelize.STRING
    }
});

export default TransactionTable;
