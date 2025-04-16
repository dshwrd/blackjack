import { Card } from './Card';

export class Hand {
    private cards: Card[];
    
    constructor() {
        this.cards = [];
    }
    
    /**
     * @description Adds a card to the hand.
     * @param card The card to add
     */
    public addCard(card: Card): void {
        this.cards.push(card);
    }

    /**
     * @description Calulates the total value of the hand.
     * @returns The total value of the hand
     */
    public calculateValue(): number {
        let totalValue = 0;
        let acesCount = 0;

        // Loop through the cards and calculate the total value
        for (const card of this.cards) {
            totalValue += card.getValue();
            // Keep track of how many aces are in the hand
            if (card.getValueString() === 'Ace') {
                acesCount++;
            }
        }

        // Adjust for Aces (If the total value is over 21 and there are Aces in the hand, treat them as 1 instead of 11)
        while (totalValue > 21 && acesCount > 0) {
            totalValue -= 10;
            acesCount--;
        }

        return totalValue;
    }

    /**
     * @description Returns the cards in the hand.
     * @return The cards in the hand
     */
    public isBlackjack(): boolean {
        return this.calculateValue() === 21 && this.cards.length === 2;
    }

    /**
     * @description Is the hand busted (over 21).
     * @return True if the hand is busted, false otherwise
     */
    public isBust(): boolean {
        return this.calculateValue() > 21;
    }

    /**
     * @description Returns the number of cards in the hand.
     * @returns Numbert of cards in the hand
     */
    public getCardCount(): number {
        return this.cards.length;
    }

    /**
     * @description Returns the cards in the hand.
     * @returns Cards in the hand.
     */
    public toString(): string {
        return this.cards.map(card => card.getCardName()).join(', ');
    }

    public reset():void {
        this.cards = [];
    }
}
