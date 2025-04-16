import gsap from 'gsap';
import * as THREE from 'three';
import { AssetManager } from '../managers/AssetManager';
import { CARD_POSITION_Y, OFFSCREEN_CARD_POSITION_X, OFFSCREEN_CARD_POSITION_Y } from './Constants';

const cardWidth = 500;
const cardHeight = 726;
const cardDepth = 1;
const cardScaleX = 0.2;
const cardScaleY = 0.2;
const cardScaleZ = 1;

export class CardHelper {
    private static instance: CardHelper;

    public static getInstance(): CardHelper {
        if (!CardHelper.instance) {
            CardHelper.instance = new CardHelper();
        }
        return CardHelper.instance;
    }

    public getCardMesh(card: string): THREE.Mesh {
        const cardName = card.split('_')[0];
        const suit = card.split('_')[2];

        return this.createCardMesh(cardName, suit);
    }

    private createCardMesh(cardValue: string, cardSuit: string): THREE.Mesh {
        const backTexture = AssetManager.getInstance().getImage('card_back');
        if (!backTexture) {
            console.log('Missing card_back texture.');
            return new THREE.Mesh(); // Return an empty mesh if the texture is missing
        }

        // Grab the card image
        const frontTexture = AssetManager.getInstance().getImage(`${cardValue}_of_${cardSuit}`.toLowerCase());

        // Create the material for the front of the card
        const frontMaterial = new THREE.MeshBasicMaterial({ map: frontTexture });
        // Create the material for the back of the card
        const backMaterial = new THREE.MeshBasicMaterial({ map: backTexture });
        // Create the material for the sides of the card (just a dark color that really shouldn't be visible)
        const sideMaterial = new THREE.MeshBasicMaterial({ color: 0x111111 });

        // Materials order: [right, left, top, bottom, front, back]
        const materials: THREE.Material[] = [
            sideMaterial, // right
            sideMaterial, // left
            sideMaterial, // top
            sideMaterial, // bottom
            frontMaterial, // front
            backMaterial  // back
        ];

        // Create the box geometry for the card
        const boxGeometry = new THREE.BoxGeometry(cardWidth, cardHeight, cardDepth);
        // Create the actual card mesh using the geometry and materials
        const cardMesh = new THREE.Mesh(boxGeometry, materials);

        // Sets a scale for the cards (I just did this by hand, but it should be in the config file somewhere)
        cardMesh.scale.set(cardScaleX, cardScaleY, cardScaleZ);
        // 400, 400 is just a placeholder for the position of the card (this would be in a config as well)
        cardMesh.position.set(OFFSCREEN_CARD_POSITION_X, OFFSCREEN_CARD_POSITION_Y, CARD_POSITION_Y);
        // Always create the cards facing down
        cardMesh.rotation.set(0, Math.PI, 0);

        return cardMesh;
    }

    animateCard(cardMesh: THREE.Mesh, xPosition: number, yPosition: number, callback: Function , shouldFlip: boolean = true): void {
        if (cardMesh === null || cardMesh === undefined) {
            throw new Error('Card mesh is null or undefined');
        }

        // Fly the card to its position
        gsap.to(cardMesh.position, {
            x: xPosition,
            y: yPosition,
            duration: 1,
            ease: "power2.out",
            onComplete: () => {
                callback();
            }});

        // Should the card flip?
        if (shouldFlip) {
            gsap.to(cardMesh.rotation, {
                y: 0,
                duration: 1,
                ease: "power2.out"
            });
        }
    }
}