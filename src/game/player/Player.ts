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

    public addCardMesh(mesh: THREE.Mesh): void {
        this.cardMeshes.push(mesh);
    }

    public getCardMeshes(): THREE.Mesh[] {
        return this.cardMeshes;
    }

    public reset(): void {
        this.standing = false;
        this.hand.reset();
        Game.getInstance().getScene().remove(...this.cardMeshes);
        this.cardMeshes.forEach(mesh => {
            mesh.geometry.dispose();
        });
        this.cardMeshes = [];
    }

    public isStanding(): boolean {
        return this.standing;
    }
}
