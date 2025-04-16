/**
 * @description Represents a playing card with a suit and value.
 */
export class Card {
    private suit: string;
    private value: string;

    constructor(suit: string, value: string) {
        this.suit = suit;
        this.value = value;
    }

    /**
     * @description Returns the suit of the card.
     * @returns {string} The suit of the card
     */
    public getSuit(): string {
        return this.suit;
    }

    /**
     * @description Returns the value of the card as a string (e.g., 'Ace', '2', '3', ..., 'King').
     * @returns {string} The value of the card
     */
    public getValueString(): string {
        return this.value;
    }

    /**
     * @description Returns the value of the card. Aces are worth 11, face cards are worth 10, and number cards are worth their face value.
     * @returns {number} The value of the card.
     */
    public getValue(): number {
        // Ace can be 1 or 11, but we will treat it as 11 for now
        // and adjust later in Hand.calculateValue()
        // This is a simplification; in a real game, you would need to handle the Ace's dual value.
        if (this.value === 'Ace') {
            return 11;
        }

        // Face cards are worth 10
        if (this.value === 'Jack' || this.value === 'Queen' || this.value === 'King') {
            return 10; 
        }
        
        // Number cards are worth their face value
        return parseInt(this.value); 
    }

    /**
     * @description Returns the name of the card.
     * @returns {string} The name of the card.
     */
    public getCardName(): string {
        return `${this.value}_of_${this.suit}`.toLocaleLowerCase();
    }

    /**
     * @description Returns the short name of the card (e.g., 'AS' for Ace of Spades).
     * @returns {string} The short name of the card.
     */
    public getShortName(): string {
        if (this.value === '10') {
            return `10${this.suit.charAt(0)}`;
        }
        return `${this.value.charAt(0)}${this.suit.charAt(0)}`;
    }
}
