import * as THREE from 'three';
import { Card } from '../cards/Card';
import { Hand } from '../cards/Hand';
import { Game } from '../Game';

/**
 * @description Represents a player in the game.
 */
export class Player {
    private cardMeshes: THREE.Mesh[];
    private hand: Hand;
    private standing: boolean = false;

    constructor() {
        this.hand = new Hand();
        this.cardMeshes = [];
    }

    /**
     * @description A method to get the player's hand.
     * @returns The player's hand.
     */
    public getHand(): Hand {
        return this.hand;
    }
    
    /**
     * @description Adds a card to the player's hand.
     * @param card The card to be added to the player's hand.
     */
    public hit(card: Card): void {
        this.hand.addCard(card);
    }

    /**
     * @description The user is standing.
     */
    public stand(): void {
        this.standing = true;
    }

    /**
     * @description A way to check if the player is standing or not.
     * @returns If the player is standing or not.
     */
    public isStanding(): boolean {
        return this.standing;
    }

    /**
     * 
     * @param mesh The new card mesh to add to the array
     */
    public addCardMesh(mesh: THREE.Mesh): void {
        this.cardMeshes.push(mesh);
    }

    /**
     * @description Method for getting all of the card meshes (for if we need to do something to a card, rotate, move, etc)
     * @returns All of the card meshes in the array
     */
    public getCardMeshes(): THREE.Mesh[] {
        return this.cardMeshes;
    }

    /**
     * @description Reset everything! And remove all the card meshes.
     */
    public reset(): void {
        this.standing = false;
        this.hand.reset();
        Game.getInstance().getScene().remove(...this.cardMeshes);
        this.cardMeshes.forEach(mesh => {
            mesh.geometry.dispose();
        });
        this.cardMeshes = [];
    }
}
