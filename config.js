const INITIAL_DIFFICULTY = 3;
const MINE_RATE = 1000;
const GENESIS_DATA = {
    timestamp:1,
    lastHash: 'firstLastHash',
    hash : 'firstHash',
    data : [],
    difficulty: INITIAL_DIFFICULTY,
    nonce : 0
};

const REWARD_INPUT = {
    address : "*thisIsTheAuthorisedReward*"
};

const MINING_REWARD = 50;

const STARTING_BALANCE = 1000;

module.exports = {
    GENESIS_DATA, 
    MINE_RATE,
    STARTING_BALANCE,
    REWARD_INPUT,
    MINING_REWARD
};