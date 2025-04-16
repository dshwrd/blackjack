import * as THREE from 'three';
import { Deck } from './cards/Deck';
import { Dealer } from './player/Dealer';
import { Player } from './player/Player';

export class Game {
    private static instance: Game;
    private scene!: THREE.Scene;
    private dealer!: Dealer;
    private player!: Player;
    private deck!: Deck;

    /**
     * @description Singleton constructor. Use getInstance() to access the instance.
     * @returns {Game} The singleton instance of the Game class.
     */
    public static getInstance(): Game {
        if (!Game.instance) {
            Game.instance = new Game();
        }
        return Game.instance;
    }

    resetGame(): void {
        // Reset the dealer
        if (this.dealer) {
            this.dealer.reset();
        }
        // Reset the player
        if (this.player) {
            this.player.reset();
        }
        // I know we technically don't have to reset the deck after each hand, but seeing as we're
        // not actually creating a shoe and using it, I figured just reshuffling the deck everytime would work.
        if (this.deck) {
            this.deck.reset();
        }
    }

    /**
     * @description Sets the scene for the game. This is where the game will be rendered.
     * @param scene The scene to set for the game.
     */
    setScene(scene: THREE.Scene): void {
        this.scene = scene;
    }

    getScene(): THREE.Scene {
        return this.scene;
    }

    getDeck(): Deck {
        return this.deck;
    }

    setDeck(deck: Deck): void {
        this.deck = deck;
    }

    getDealer(): Dealer {
        return this.dealer;
    }

    setDealer(dealer: Dealer): void {
        this.dealer = dealer;
    }

    getPlayer(): Player {
        return this.player;
    }

    setPlayer(player: Player): void {
        this.player = player;
    }

    /**
     * @description Check if the player won the game.
     * @returns {boolean} If the player won the game.
     */
    checkIfWinner(): boolean {
        return this.player.getHand().calculateValue() <= 21 && this.dealer.getHand().calculateValue() > 21;
    }

    /**
     * @description Check if the player and dealer have the same hand value. If so, it's a push. Refund the bet.
     * @returns {boolean} If both hands match
     */
    checkIfPush(): boolean {
        return this.player.getHand().calculateValue() === this.dealer.getHand().calculateValue();
    }
}