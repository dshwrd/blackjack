import { Game } from '../game/Game';
import { StateManager } from '../managers/StateManager';
import { CardHelper } from '../utils/CardHelper';
import { DEALER_CARD_X_OFFSET, DEALER_CARD_X_POSITION, DEALER_CARD_Y_POSITION, DEALER_MAX_HAND_VALUE, DEFAULT_PLAYER_HAND_SIZE } from '../utils/Constants';
import { IState } from './IState';

/**
 * DealerState is the state in which the dealer is playing their hand.
 * The dealer will hit until they reach a hand value of 17 or higher, or until they bust.
 */
export class DealerState implements IState {
    public name: string = 'DealerState';

    constructor() {
        // Bind the checkIfShouldHit method to the current instance
        // This is necessary because the method is passed as a callback and needs to maintain the correct context.
        this.checkIfShouldHit = this.checkIfShouldHit.bind(this);
    }

    /**
     * The enter method is called when the dealer state is entered.
     * It will animate the dealer's second card and call the checkIfShouldHit method to determine if the dealer should hit or stand.
     */
    public enter(): void {
        console.log('Entering Dealer State');

        // Helper to animate the dealer's second card
        CardHelper.getInstance().animateCard(Game.getInstance().getDealer().getCardMeshes()[1], 0, DEALER_CARD_Y_POSITION, this.checkIfShouldHit);
    }

    /**
     * Exiting the state, no cleanup is needed for the dealer state.
     */
    public exit(): void {
        console.log('Exiting Dealer State');
    }

    /**
     * The checkIfShouldHit method is called to determine if the dealer should hit or stand.
     * The dealer will hit if their hand value is less than 17, and they will stand if their hand value is 17 or higher.
     */
    private checkIfShouldHit(): void {
        const dealerHandValue = Game.getInstance().getDealer().getHand().calculateValue();

        // Dealers can't hit on 17 or higher.
        if (dealerHandValue > Game.getInstance().getPlayer().getHand().calculateValue() && Game.getInstance().getPlayer().isStanding()) {
            // Dealer won, so we can skip the hit and move onto the next state.
            StateManager.getInstance().nextState();
        } else  if (dealerHandValue < DEALER_MAX_HAND_VALUE) {
            // Game Instance
            let game = Game.getInstance();
            // Grab the first card from the deck
            let card = game.getDeck().drawCard();
            // Grab the card mesh from the CardBuilder
            let cardMesh = CardHelper.getInstance().getCardMesh(card.getCardName());
            // We need to offset the X Position of the card, based on how many cards are in the hand.
            let cardXPosition = (game.getDealer().getHand().getCardCount() - DEFAULT_PLAYER_HAND_SIZE) * DEALER_CARD_X_OFFSET;
    
            // Add the card to the dealer's hand and scene
            game.getDealer().hit(card);
            game.getScene().add(cardMesh);
            game.getDealer().addCardMesh(cardMesh);

            // Helper to animate the card
            CardHelper.getInstance().animateCard(cardMesh, -DEALER_CARD_X_POSITION - cardXPosition, DEALER_CARD_Y_POSITION, this.checkIfShouldHit);

            console.log('Dealer hits! Hand value: ' + dealerHandValue);
        } else if (!Game.getInstance().getDealer().isStanding()) {
            console.log('Dealer stands! Hand value: ' + dealerHandValue);
            // Set standing to true (This is set to false on reset)
            Game.getInstance().getDealer().stand();
            // Move onto the next state if we're done
            StateManager.getInstance().nextState();
        }
    }
}