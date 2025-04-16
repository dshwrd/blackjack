import HitButtonEvent from '../events/HitButtonEvent';
import StandButtonEvent from '../events/StandButtonEvent';
import { Game } from '../game/Game';
import { StateManager } from '../managers/StateManager';
import { BlackJackScence } from '../ui/BlackJackScene';
import { CardHelper } from '../utils/CardHelper';
import { DEFAULT_PLAYER_HAND_SIZE, PLAYER_CARD_X_OFFSET, PLAYER_CARD_X_POSITION, PLAYER_CARD_Y_POSTION } from '../utils/Constants';
import { IState } from './IState';

export class PlayerState implements IState {
    public name: string = 'PlayerState';

    constructor() {
        this.hit = this.hit.bind(this);
        this.stand = this.stand.bind(this);
        this.checkHand = this.checkHand.bind(this);
    }

    public enter(): void {
        console.log('Entering Player State');

        // Add Event Listeners for Hit and Stand
        document.addEventListener(HitButtonEvent.EVENT_NAME, this.hit);
        document.addEventListener(StandButtonEvent.EVENT_NAME, this.stand);
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

        CardHelper.getInstance().animateCard(cardMesh, -PLAYER_CARD_X_POSITION - cardXPosition, PLAYER_CARD_Y_POSTION, this.checkHand);
        
        game.getPlayer().hit(card);
        game.getScene().add(cardMesh);
        game.getPlayer().addCardMesh(cardMesh);
    }

    /**
     * @description Check the player's hand for bust or blackjack and updates states accordingly.
     */
    private checkHand():void {
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

    public exit(): void {
        console.log('Exiting Player State');
        BlackJackScence.getInstance().toggleGamePlayScreen();

        // Remove Event Listeners for Hit and Stand
        document.removeEventListener(HitButtonEvent.EVENT_NAME, this.hit);
        document.removeEventListener(StandButtonEvent.EVENT_NAME, this.stand);
    }
}