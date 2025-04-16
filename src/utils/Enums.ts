/**
 * Enums for Game Over Messages for the Game Over screen
 */
export enum GameOverMessages {
    PLAYER_BLACKJACK = 'Player has Blackjack! Player Wins!',
    DEALER_BLACKJACK = 'Dealer has Blackjack! Dealer Wins!',
    PLAYER_BUST = 'Player Busted! Dealer Wins!',
    DEALER_BUST = 'Dealer Busted! Player Wins!',
    PUSH = 'Whoa a Push! No one wins!',
    PLAYER_WINS = 'Player Wins!',
    DEALER_WINS = 'Dealer Wins!',
    DEFAULT = '...'
}

/**
 * Enums for Game Over Sub Messages for the Game Over screen
 */
export enum GameOverSubMessages {
    PLAYER = 'Player: ',
    DEALER = 'Dealer: ',
    VS = ' vs '
}

/**
 * Enums for the Game Play Messages
 */
export enum GamePlayMessage {
    PLAYER = 'Player: ',
    DEALER = 'Dealer: ',
}

/**
 * Enums for the Welcome Screen Messages
 */
export enum WelcomeScreenMessages {
    WELCOME = 'Welcome to Blackjack!',
    DAN = 'A Code Test by Dan H.',
    NEW_GAME = 'New Game'
}

/**
 * Enums for the Game Play Buttons
 */
export enum GamePlayButtons {
    HIT = 'Hit',
    STAND = 'Stand'
}

/**
 * Enums for the Game States
 */
export enum States {
    SETUP = 'SetupState',
    DEAL = 'DealState',
    PLAYER = 'PlayerState',
    DEALER = 'DealerState',
    GAME_OVER = 'GameOverState'
}