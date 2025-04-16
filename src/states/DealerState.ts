import { Game } from '../game/Game';
import { StateManager } from '../managers/StateManager';
import { CardHelper } from '../utils/CardHelper';
import { DEALER_CARD_X_OFFSET, DEALER_CARD_X_POSITION, DEALER_CARD_Y_POSITION, DEALER_MAX_HAND_VALUE, DEFAULT_PLAYER_HAND_SIZE } from '../utils/Constants';
import { IState } from './IState';

export class DealerState implements IState {
    public name: string = 'DealerState';
    private standing: boolean = false;

    constructor() {
        this.checkIfShouldHit = this.checkIfShouldHit.bind(this);
    }

    public enter(): void {
        console.log('Entering Dealer State');
        this.standing = false;

        CardHelper.getInstance().animateCard(Game.getInstance().getDealer().getCardMeshes()[1], 0, DEALER_CARD_Y_POSITION, this.checkIfShouldHit);
    }

    public exit(): void {
        console.log('Exiting Dealer State');
    }

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
    
            CardHelper.getInstance().animateCard(cardMesh, -DEALER_CARD_X_POSITION - cardXPosition, DEALER_CARD_Y_POSITION, this.checkIfShouldHit);

            game.getDealer().hit(card);
            game.getScene().add(cardMesh);
            game.getDealer().addCardMesh(cardMesh);

            console.log('Dealer hits! Hand value: ' + dealerHandValue);
            this.checkIfShouldHit();
        } else if (!this.standing) {
            this.standing = true;
            console.log('Dealer stands! Hand value: ' + dealerHandValue);
            StateManager.getInstance().nextState();
        }
    }
}