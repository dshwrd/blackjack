import HitButtonEvent from '../events/HitButtonEvent';
import StandButtonEvent from '../events/StandButtonEvent';
import { Game } from '../game/Game';
import { StateManager } from '../managers/StateManager';
import { UIScene } from '../ui/UIScene';
import { CardHelper } from '../utils/CardHelper';
import { DEFAULT_PLAYER_HAND_SIZE, PLAYER_CARD_X_OFFSET, PLAYER_CARD_X_POSITION, PLAYER_CARD_Y_POSTION } from '../utils/Constants';
import { GamePlayMessage } from '../utils/Enums';
import { IState } from './IState';

/**
 * PlayerState is the state in which the player is playing their hand.
 * The player can hit or stand, and the game will check for bust or blackjack.
 */
export class PlayerState implements IState {
    public name: string = 'PlayerState';

    constructor() {
        // Bind all our functions here, they're either callbacks or event listeners.
        // This is necessary because the method is passed as a callback and needs to maintain the correct context.
        this.hit = this.hit.bind(this);
        this.stand = this.stand.bind(this);
        this.checkHand = this.checkHand.bind(this);
    }

    /**
     * @description Entering the state, turn on the game play screen and add event listeners for hit and stand.
     */
    public enter(): void {
        console.log('Entering Player State');

        // Turn on the game play screen
        UIScene.getInstance().toggleGamePlayScreen();

        // First we need to verify that the player doesn't have blackjack already
        this.checkForBlackjack();

        // Updates a message right below the hit/stand buttons, to display the total value of the players cards.
        UIScene.getInstance().updateGamePlayMessageMessage(GamePlayMessage.PLAYER + Game.getInstance().getPlayer().getHand().calculateValue());

        // Add Event Listeners for Hit and Stand
        document.addEventListener(HitButtonEvent.EVENT_NAME, this.hit);
        document.addEventListener(StandButtonEvent.EVENT_NAME, this.stand);
    }

    /**
     * @description Check if the Player has Blackjack, if so, move to the next state
     */
    private checkForBlackjack(): void {
        if (Game.getInstance().getPlayer().getHand().isBlackjack()) {
            // The player has blackjack, move to the dealer state
            StateManager.getInstance().nextState();
        }
    }

    /**
     * @description Hit the player. This will draw a card from the deck and add it to the player's hand.
     */
    private hit():void {
        // Game Instance
        let game = Game.getInstance();
        // Grab the first card from the deck
        let card = game.getDeck().drawCard();
        // Grab the card mesh from the CardBuilder
        let cardMesh = CardHelper.getInstance().getCardMesh(card.getCardName());
        // We need to offset the X Position of the card, based on how many cards are in the hand.
        let cardXPosition = (game.getPlayer().getHand().getCardCount() - DEFAULT_PLAYER_HAND_SIZE) * PLAYER_CARD_X_OFFSET;

        // Updates a message right below the hit/stand buttons, to display the total value of the players cards.
        CardHelper.getInstance().animateCard(cardMesh, -PLAYER_CARD_X_POSITION - cardXPosition, PLAYER_CARD_Y_POSTION, this.checkHand);
        
        game.getPlayer().hit(card);
        game.getScene().add(cardMesh);
        game.getPlayer().addCardMesh(cardMesh);
    }

    /**
     * @description Check the player's hand for bust or blackjack and updates states accordingly.
     */
    private checkHand():void {
        UIScene.getInstance().updateGamePlayMessageMessage(GamePlayMessage.PLAYER + Game.getInstance().getPlayer().getHand().calculateValue());

        let player = Game.getInstance().getPlayer();
        console.log('Hand value: ' + player.getHand().calculateValue());
        if (player.getHand().isBust()) {
            console.log('Player Bust!');
            StateManager.getInstance().changeState('GameOverState');
        }

        if (player.getHand().isBlackjack()) {
            console.log('Player Blackjack!');
            StateManager.getInstance().nextState()
        }
    }

    /**
     * @description Stand the player. This will end the player's turn and move to the dealer's turn.
     */
    private stand():void {
        console.log('Player Stands!');
        console.log('Hand value: ' + Game.getInstance().getPlayer().getHand().calculateValue());
        Game.getInstance().getPlayer().stand();
        StateManager.getInstance().nextState();
    }

    /**
     * @description Exiting the state, hide the game play screen and remove event listeners for hit and stand.
     */
    public exit(): void {
        console.log('Exiting Player State');
        UIScene.getInstance().toggleGamePlayScreen();

        // Remove Event Listeners for Hit and Stand
        document.removeEventListener(HitButtonEvent.EVENT_NAME, this.hit);
        document.removeEventListener(StandButtonEvent.EVENT_NAME, this.stand);
    }
}