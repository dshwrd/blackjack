import { CSS2DObject } from "three/examples/jsm/Addons.js";
import { Game } from "../game/Game";
import StartGameEvent from '../events/StartGameEvent';
import HitButtonEvent from '../events/HitButtonEvent';
import StandButtonEvent from '../events/StandButtonEvent';
import { StateManager } from '../managers/StateManager';
import { GamePlayButtons, WelcomeScreenMessages } from '../utils/Enums';

/**
 * @description UIScene is a class that handles the UI elements in the game.
 * @description It creates the welcome screen and the game play screen.
 */
export class UIScene {
    public static instance: UIScene = new UIScene();
    private uiContainer!: CSS2DObject;
    private uiDiv: HTMLDivElement | null = null;
    private messageScreenDiv: HTMLDivElement | null = null;
    private gamePlayDiv: HTMLDivElement | null = null;
    private messageElement: HTMLDivElement | null = null;
    private subMessageElement: HTMLDivElement | null = null;
    private gamePlayMessageElement: HTMLDivElement | null = null;

    public static getInstance(): UIScene {
        if (!UIScene.instance) {
            UIScene.instance = new UIScene();
        }
        return UIScene.instance;
    }

    /**
     * @description Init is used to build the UI before it's needed
     */
    init():void {
        this.setupMainContainer();
        this.setupWelcomeScreen();
        this.setupGamePlayScreen();
    }

    /**
     * @description The main container for all of the UI elements in our scene.
     */
    setupMainContainer():void {
        console.log('Setting up main container for UI');

        // Create the main UI container div
        this.uiDiv = document.createElement('div');
        this.uiDiv.style.display = 'flex';
        this.uiDiv.style.flexDirection = 'column';
        this.uiDiv.style.alignItems = 'center';
        this.uiDiv.style.justifyContent = 'center';
        this.uiDiv.style.fontFamily = 'Arial, sans-serif';
        this.uiDiv.style.padding = '20px';
        this.uiDiv.style.backgroundColor = 'rgba(0, 0, 0, 0.0)';
        this.uiDiv.style.borderRadius = '10px';
        this.uiDiv.style.pointerEvents = 'auto';

        // Create the CSS2DObject for the UI container and add the UI Container to it
        this.uiContainer = new CSS2DObject(this.uiDiv);

        // Set the position of the UI container in 3D space
        this.uiContainer.position.set(0, 0, 1);

        // Add the uiCointer to the game scene
        Game.getInstance().getScene().add(this.uiContainer);
    }

    /**
     * @description The welcome screem is the initial screen shown, when launching the game.
     */
    setupWelcomeScreen(): void {
        console.log('Setting up Welcome Screen!');

        // Create the welcome screen div
        this.messageScreenDiv = document.createElement('div');
        this.messageScreenDiv.style.padding = '20px';
        this.messageScreenDiv.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        this.messageScreenDiv.style.display = 'flex';
        this.messageScreenDiv.style.flexDirection = 'column';
        this.messageScreenDiv.style.alignItems = 'center';

        // Create the title element
        this.messageElement = document.createElement('div');
        this.messageElement.textContent = WelcomeScreenMessages.WELCOME;
        this.messageElement.style.color = 'gold';
        this.messageElement.style.fontStyle = 'Bold';
        this.messageScreenDiv.appendChild(this.messageElement);

        // Create the sub message element
        this.subMessageElement = document.createElement('div');
        this.subMessageElement.textContent = WelcomeScreenMessages.DAN;
        this.subMessageElement.style.color = 'gold';
        this.subMessageElement.style.fontSize = '0.8em';
        this.subMessageElement.style.textAlign = 'center';
        this.subMessageElement.style.marginBottom = '100px';
        this.messageScreenDiv.appendChild(this.subMessageElement);

        // Create the new game button
        const newGameButton = document.createElement('div');
        newGameButton.textContent = WelcomeScreenMessages.NEW_GAME;
        newGameButton.style.textAlign = 'center';
        newGameButton.style.padding = '10px 20px';
        newGameButton.style.fontSize = '1.2em';
        newGameButton.style.cursor = 'pointer';
        newGameButton.style.border = 'none';
        newGameButton.style.borderRadius = '5px';
        newGameButton.style.backgroundColor = '#111111';
        newGameButton.style.color = 'white';
        newGameButton.style.pointerEvents = 'auto';
        newGameButton.addEventListener('click', () => {
            this.toggleMessageScreen();
            if (StateManager.getInstance().getCurrentState()?.name !== 'SetupState') {
                Game.getInstance().resetGame();
                StateManager.getInstance().changeState('DealState');
            } else {
                document.dispatchEvent(new StartGameEvent());
            }

        });
        // Add the new game button to the message screen
        this.messageScreenDiv.appendChild(newGameButton);

        // Set the message screen to hidden by default
        this.messageScreenDiv.style.display = 'none';

        // Add the message screen to the main UI container
        this.uiDiv!.appendChild(this.messageScreenDiv);
    }

    /**
     * @description The game play screen is shown when the game is in progress.
     */
    setupGamePlayScreen(): void {
        console.log('Setting up Game Play Screen!');

        // Create the game play screen div
        this.gamePlayDiv = document.createElement('div');
        this.gamePlayDiv.style.padding = '20px';
        this.gamePlayDiv.style.backgroundColor = 'rgba(0, 0, 0, 0)';
        this.gamePlayDiv.style.width = '300px';
        this.gamePlayDiv.style.height = '650px';
        this.gamePlayDiv.style.display = 'flex';
        this.gamePlayDiv.style.flexDirection = 'column';

        // Create the button container (a way to group the buttons together)
        const buttonContainer = document.createElement('div');
        buttonContainer.style.display = 'flex';
        buttonContainer.style.justifyContent = 'space-between';
        buttonContainer.style.marginTop = 'auto'; 
        buttonContainer.style.gap = '10px';
        
        // Create the hit button for the gameplay loop
        const hitButton = document.createElement('div');
        hitButton.textContent = GamePlayButtons.HIT;
        hitButton.style.textAlign = 'center';
        hitButton.style.padding = '10px 20px';
        hitButton.style.fontSize = '1.2em';
        hitButton.style.cursor = 'pointer';
        hitButton.style.border = 'none';
        hitButton.style.borderRadius = '5px';
        hitButton.style.backgroundColor = '#111111';
        hitButton.style.color = 'white';
        hitButton.style.pointerEvents = 'auto';
        buttonContainer.appendChild(hitButton);
        hitButton.addEventListener('click', () => {
            document.dispatchEvent(new HitButtonEvent());

        });
        
        // Create the stand button for the gameplay loop
        const standButton = document.createElement('div');
        standButton.textContent = GamePlayButtons.STAND;
        standButton.style.textAlign = 'center';
        standButton.style.padding = '10px 20px';
        standButton.style.fontSize = '1.2em';
        standButton.style.cursor = 'pointer';
        standButton.style.border = 'none';
        standButton.style.borderRadius = '5px';
        standButton.style.backgroundColor = '#111111';
        standButton.style.color = 'white';
        standButton.style.pointerEvents = 'auto';
        buttonContainer.appendChild(standButton);
        standButton.addEventListener('click', () => {
            document.dispatchEvent(new StandButtonEvent());

        });
        
        // Add the button container to the game play screen
        this.gamePlayDiv.appendChild(buttonContainer);

        // Create the title element
        this.gamePlayMessageElement = document.createElement('div');
        this.gamePlayMessageElement.textContent = "";
        this.gamePlayMessageElement.style.color = 'gold';
        this.gamePlayMessageElement.style.fontStyle = 'Bold';
        this.gamePlayMessageElement.style.marginTop = '5px'
        this.gamePlayMessageElement.style.textAlign = 'center';
        this.gamePlayDiv.appendChild(this.gamePlayMessageElement);

        // Hide the game play screen by default
        this.gamePlayDiv.style.display = 'none';
        
        // Add the game play screen to the main UI container
        this.uiDiv!.appendChild(this.gamePlayDiv);
    }

    /**
     * @description Updates the game over screen with the provided message.
     * @param message - The message to display on the game over screen.
     */
    updateGameOverScreen(message: string): void {
        if (this.messageElement) {
            this.messageElement.textContent = message;
        }
    }

    /**
     * @description Updates the game over screen with the provided message.
     * @param message - The message to display on the game over screen.
     */
    updateGameOverSubScreen(message: string): void {
        if (this.subMessageElement) {
            this.subMessageElement.textContent = message;
        }
    }

    updateGamePlayMessageMessage(message: string): void {
        if (this.gamePlayMessageElement) {
            this.gamePlayMessageElement.textContent = message;
        }
    }

    /**
     * @description Toggles the visibility of the message screen.
     * @description NOTE: This is used for the Welcome Panel and the Game Over Panel.
     * @description In a production build, we'd have different assets for each screen
     * @description but for now, we'll just toggle the same screen.
     */
   toggleMessageScreen(): void {
        if (this.messageScreenDiv) {
            this.messageScreenDiv.style.display = this.messageScreenDiv.style.display === 'none' ? 'flex' : 'none';
        }
    }

    /**
     * @description Toggles the visibility of the game play screen.
     */
    toggleGamePlayScreen(): void {
        if (this.gamePlayDiv) {
            this.gamePlayDiv.style.display = this.gamePlayDiv.style.display === 'none' ? 'flex' : 'none';
        }
    }
}