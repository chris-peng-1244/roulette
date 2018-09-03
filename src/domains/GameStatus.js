const GameStatus = {
    // Game starts
    STARTED: 'GAME_STARTED',
    // Game didn't reach its goal
    FAIL_AT_ITS_OWN_ROUND: 'GAME_FAIL_AT_ITS_OWN_ROUND',
    // Game reached its goal, waiting for next round to pass.
    PENDING_FOR_NEXT_ROUND: 'GAME_PENDING_FOR_NEXT_ROUND',
    // Game succeeds when its next round passes.
    SUCCEED: 'GAME_SUCCEED',
    // Game failed because its next round failed.
    FAIL_AT_NEXT_ROUND: 'GAME_FAIL_AT_NEXT_ROUND',
};

export default GameStatus;
