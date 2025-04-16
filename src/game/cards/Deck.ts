import { Card } from './Card';

export class Deck {
    private cards: Card[];

    /**
     *  I went with 1 standard 52 card deck for this game of blackjack. 
     *  Normally I would make a shoe class with an input of X amount of 
     *  decks for a production level game.
     */

    constructor() {
        this.cards = this.createDeck();
    }

    /**
     * @description Creates 1 standard deck of 52 playing cards.
     * @returns A new deck of cards
     */
    private createDeck(): Card[] {
        const suits = ['Hearts', 'Diamonds', 'Clubs', 'Spades'];
        const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'Jack', 'Queen', 'King', 'Ace'];
        const deck: Card[] = [];

        for (const suit of suits) {
            for (const value of values) {
                deck.push(new Card(suit, value));
            }
        }

        return deck;
    }

    /**
     * @description Shuffles the deck of cards.
     * @returns {void}
     */
    public shuffle(): void {
        for (let i = this.cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
        }
    }

    /**
     * @description Draws a card from the top of the deck.
     * @returns {Card} The drawn card
     * @throws {Error} If there are no cards left in the deck
     */
    public drawCard(): Card {
        if (this.cards.length === 0) {
            throw new Error('No cards left in the deck');
        }

        return this.cards.pop()!;
    }

    public reset(): void {
        this.cards = [];
        this.cards = this.createDeck();
    }
}
