import { Card } from '../game/cards/Card';
import { Deck } from '../game/cards/Deck';
import { Game } from '../game/Game';
import { Player } from '../game/player/Player';
import { StateManager } from '../managers/StateManager';
import { CardHelper } from '../utils/CardHelper';
import { IState } from './IState';
import { DEALER_CARD_X_OFFSET, DEALER_CARD_X_POSITION, DEALER_CARD_Y_POSITION, DEFAULT_PLAYER_HAND_SIZE, PLAYER_CARD_X_OFFSET, PLAYER_CARD_X_POSITION, PLAYER_CARD_Y_POSTION } from '../utils/Constants';

/**
 * DealState is the state in which the player and dealer are dealt their initial hands.
 */
export class DealState implements IState {
    public name: string = 'DealState';

    constructor() {
        // Bind the dealNextCard method to the current instance
        // This is necessary because the method is passed as a callback and needs to maintain the correct context.
        this.dealNextCard = this.dealNextCard.bind(this);
    }

    /**
     * Entering the state deal the first card to the player.
     */
    public enter(): void {
        console.log('Entering Deal State');

        this.deal();
    }
    
    /**
     * Exiting the state, no cleanup is needed for the deal state.
     */
    public exit(): void {
        console.log('Exiting Deal State');
    }

    /**
     * @description Deals the first card to the player. 
     */
    private deal(): void {
        let deck: Deck = Game.getInstance().getDeck();
        let player: Player = Game.getInstance().getPlayer();

        // Shuffle the cards!
        Game.getInstance().getDeck().shuffle();
                
        // Deal first card to the player (callbacks will deal the next card)
        this.dealCard(deck, player);
    }

    /**
     * @description Deals the initial card to the player, follow up cards are handled through the callback in animateCard.
     * @param deck The deck to draw from
     * @param player The player to deal the card to
     */
    private dealCard(deck: Deck, player: Player): void {
        let card: Card = deck.drawCard();
        let cardMesh = CardHelper.getInstance().getCardMesh(card.getCardName());

        player.hit(card);
        Game.getInstance().getScene().add(cardMesh);
        player.addCardMesh(cardMesh);
        
        // Animate the card to the player's hand
        // The last parameter is a boolean for if we should flip the card or not. If it's
        // the second card for the dealer, we do not flip it initially.
        CardHelper.getInstance().animateCard(cardMesh, this.getCardXPosition(), this.getCardYPosition(), this.dealNextCard, (Game.getInstance().getDealer().getHand().getCardCount() < 2));
    }

    /**
     * @description Deal the next card to the player or dealer based on the hand size.
     */
    dealNextCard(): void {
        let player = Game.getInstance().getPlayer();
        let dealer = Game.getInstance().getDealer();

        // Once the dealer has 2 cards, let's move onto the next state (Player State)
        if (dealer.getHand().getCardCount() === DEFAULT_PLAYER_HAND_SIZE) {
            StateManager.getInstance().nextState();
            // If the player doesn't have two cards yet, deal another one to the player.
        } else if (player.getHand().getCardCount() < DEFAULT_PLAYER_HAND_SIZE) {
            this.dealCard(Game.getInstance().getDeck(), player);
        } else {
            // Otherwise, we are dealing to the dealer.
            this.dealCard(Game.getInstance().getDeck(), dealer);
        }
    }

    /**
     * @description Get the X position of the card based on the player or dealer.
     * @returns The X position of the card based on the player or dealer
     */
    getCardXPosition(): number {
        let xPosition = 0;
        let xPositionOffset = 0;
        // If the dealer has no cards, we are dealing to the player.
        if (Game.getInstance().getDealer().getHand().getCardCount() === 0) {
            xPosition = PLAYER_CARD_X_POSITION;
            xPositionOffset = PLAYER_CARD_X_OFFSET * (Game.getInstance().getPlayer().getHand().getCardCount() - 1);
        } else {
            // Otherwise, we are dealing to the dealer.
            xPosition = DEALER_CARD_X_POSITION
            xPositionOffset = DEALER_CARD_X_OFFSET * (Game.getInstance().getDealer().getHand().getCardCount() - 1);
        }

        return xPosition - xPositionOffset;
    }

    /**
     * @description Get the Y position of the card based on the player or dealer.
     * @returns The Y position of the card based on the player or dealer
     */
    getCardYPosition():number {
        return (Game.getInstance().getDealer().getHand().getCardCount() < 1 ? PLAYER_CARD_Y_POSTION : DEALER_CARD_Y_POSITION);
    }
}