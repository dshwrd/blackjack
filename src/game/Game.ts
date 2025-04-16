import * as THREE from 'three';
import { Deck } from './cards/Deck';
import { Player } from './player/Player';

/**
 * @description Singleton class that helps manage the different elements of the game
 * @description (e.g. scene, dealer, player, deck). Has some helper functions to
 * @description help manage the game.
 */
export class Game {
    private static instance: Game;
    private scene!: THREE.Scene;
    private dealer!: Player;
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

    /**
     * @description Reset all elements of the game.
     */
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

    /**
     * @description Helper function for getting the game scene.
     * @returns {THREE.Scene} The scene for the game.
     */
    getScene(): THREE.Scene {
        return this.scene;
    }

    /**
     * @description Helper function for getting the game deck.
     * @returns {Deck} The deck for the game.
     */
    getDeck(): Deck {
        return this.deck;
    }

    setDeck(deck: Deck): void {
        this.deck = deck;
    }

    /**
     * @description Helper function for getting the dealer for the game.
     * @description NOTE: The Dealer is just a Player class.
     * @returns {Player} The dealer for the game.
     */
    getDealer(): Player {
        return this.dealer;
    }

    /**
     * @description Set the dealer for the game.
     * @param dealer The dealer object.
     */
    setDealer(dealer: Player): void {
        this.dealer = dealer;
    }

    /**
     * @description Helper function for getting the player for the game.
     * @returns {Player} The player for the game.
     */
    getPlayer(): Player {
        return this.player;
    }

    /**
     * @description Set the player for the game.
     * @param player The player object.
     */
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