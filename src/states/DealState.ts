import { Card } from '../game/cards/Card';
import { Deck } from '../game/cards/Deck';
import { Game } from '../game/Game';
import { Player } from '../game/player/Player';
import { StateManager } from '../managers/StateManager';
import { CardHelper } from '../utils/CardHelper';
import { IState } from './IState';
import { DEALER_CARD_X_OFFSET, DEALER_CARD_X_POSITION, DEALER_CARD_Y_POSITION, DEFAULT_PLAYER_HAND_SIZE, PLAYER_CARD_X_OFFSET, PLAYER_CARD_X_POSITION, PLAYER_CARD_Y_POSTION } from '../utils/Constants';
import { BlackJackScence } from '../ui/BlackJackScene';

export class DealState implements IState {
    public name: string = 'DealState';

    constructor() {
        this.dealNextCard = this.dealNextCard.bind(this);
    }

    public enter(): void {
        console.log('Entering Deal State');

        BlackJackScence.getInstance().toggleGamePlayScreen();
        this.deal();
    }

    public exit(): void {
        console.log('Exiting Deal State');
    }

    private deal(): void {
        let deck: Deck = Game.getInstance().getDeck();
        let player: Player = Game.getInstance().getPlayer();

        // Shuffle the deck
        deck.shuffle();
                
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
        CardHelper.getInstance().animateCard(cardMesh, this.getCardXPosition(), this.getCardYPosition(), this.dealNextCard, (Game.getInstance().getDealer().getHand().getCardCount() < 2));
    }

    /**
     * @description Deal the next card to the player or dealer based on the hand size.
     */
    dealNextCard(): void {
        let player = Game.getInstance().getPlayer();
        let dealer = Game.getInstance().getDealer();

        if (dealer.getHand().getCardCount() === DEFAULT_PLAYER_HAND_SIZE) {
            StateManager.getInstance().nextState();
        } else if (player.getHand().getCardCount() < DEFAULT_PLAYER_HAND_SIZE) {
            this.dealCard(Game.getInstance().getDeck(), player);
        } else {
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
        if (Game.getInstance().getDealer().getHand().getCardCount() === 0) {
            xPosition = PLAYER_CARD_X_POSITION;
            xPositionOffset = PLAYER_CARD_X_OFFSET * (Game.getInstance().getPlayer().getHand().getCardCount() - 1);
        } else {
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