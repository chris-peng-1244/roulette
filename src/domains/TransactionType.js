// @flow
const TransactionType = {
    // 参与游戏失败后退款
    REFUND: 'TRANSACTION_REFUND',
    // 参与游戏
    BET: 'TRANSACTION_BET',
    // 充值
    DEPOSIT: 'TRANSACTION_DEPOSIT',
    // 提现
    WITHDRAW: 'TRANSACTION_WITHDRAW',
    // 参与游戏成功后发放奖励
    REWARD: 'TRANSACTION_REWARD',
};

export default TransactionType;
