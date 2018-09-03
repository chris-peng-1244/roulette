const GameStatus = {
    // GameTable starts
    STARTED: 'GAME_STARTED',
    // GameTable didn't reach its goal
    FAIL_AT_ITS_OWN_ROUND: 'GAME_FAIL_AT_ITS_OWN_ROUND',
    // GameTable reached its goal, waiting for next round to pass.
    PENDING_FOR_NEXT_ROUND: 'GAME_PENDING_FOR_NEXT_ROUND',
    // GameTable succeeds when its next round passes.
    SUCCEED: 'GAME_SUCCEED',
    // GameTable failed because its next round failed.
    FAIL_AT_NEXT_ROUND: 'GAME_FAIL_AT_NEXT_ROUND',
};

export default GameStatus;
