export enum GameOverMessages {
    PLAYER_BLACKJACK = 'Player has Blackjack! Player Wins!',
    PLAYER_BUST = 'Player Busted! Dealer Wins!',
    DEALER_BUST = 'Dealer Busted! Player Wins!',
    PUSH = 'Whoa a Push! No one wins!',
    PLAYER_WINS = 'Player Wins!',
    DEALER_WINS = 'Dealer Wins!',
    DEFAULT = '...'
}

export enum GameOverSubMessages {
    PLAYER = 'Player: ',
    DEALER = 'Dealer: ',
    VS = ' vs '
}

export enum WelcomeScreenMessages {
    WELCOME = 'Welcome to Blackjack!',
    DAN = 'A Code Test by Dan H.',
    NEW_GAME = 'New Game'
}

export enum GamePlayButtons {
    HIT = 'Hit',
    STAND = 'Stand'
}