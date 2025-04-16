import { CSS2DObject } from "three/examples/jsm/Addons.js";
import { Game } from "../game/Game";
import StartGameEvent from '../events/StartGameEvent';
import HitButtonEvent from '../events/HitButtonEvent';
import StandButtonEvent from '../events/StandButtonEvent';
import { StateManager } from '../managers/StateManager';
import { GamePlayButtons, WelcomeScreenMessages } from '../utils/Enums';


export class BlackJackScence {
    public static instance: BlackJackScence = new BlackJackScence();
    private uiContainer!: CSS2DObject;
    private uiDiv: HTMLDivElement | null = null;
    private messageScreenDiv: HTMLDivElement | null = null;
    private gamePlayDiv: HTMLDivElement | null = null;
    private messageElement: HTMLDivElement | null = null;
    private subMessageElement: HTMLDivElement | null = null;

    public static getInstance(): BlackJackScence {
        if (!BlackJackScence.instance) {
            BlackJackScence.instance = new BlackJackScence();
        }
        return BlackJackScence.instance;
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

        this.uiContainer = new CSS2DObject(this.uiDiv);

        this.uiContainer.position.set(0, 0, 1); 
        Game.getInstance().getScene().add(this.uiContainer);
    }

    /**
     * @description The welcome screem is the initial screen shown, when launching the game.
     */
    setupWelcomeScreen(): void {
        console.log('Setting up Welcome Screen!');
        this.messageScreenDiv = document.createElement('div');
        this.messageScreenDiv.style.padding = '20px';
        this.messageScreenDiv.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        this.messageScreenDiv.style.display = 'flex';
        this.messageScreenDiv.style.flexDirection = 'column';
        this.messageScreenDiv.style.alignItems = 'center';

        this.messageElement = document.createElement('div');
        this.messageElement.textContent = WelcomeScreenMessages.WELCOME;
        this.messageElement.style.color = 'gold';
        this.messageElement.style.fontStyle = 'Bold';
        this.messageScreenDiv.appendChild(this.messageElement);

        this.subMessageElement = document.createElement('div');
        this.subMessageElement.textContent = WelcomeScreenMessages.DAN;
        this.subMessageElement.style.color = 'gold';
        this.subMessageElement.style.fontSize = '0.8em';
        this.subMessageElement.style.textAlign = 'center';
        this.subMessageElement.style.marginBottom = '100px';
        this.messageScreenDiv.appendChild(this.subMessageElement);

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
        this.messageScreenDiv.style.display = 'none';
        this.messageScreenDiv.appendChild(newGameButton);

        this.uiDiv!.appendChild(this.messageScreenDiv);
    }

    /**
     * @description The game play screen is shown when the game is in progress.
     */
    setupGamePlayScreen(): void {
        console.log('Setting up Game Play Screen!');
        this.gamePlayDiv = document.createElement('div');
        this.gamePlayDiv.style.padding = '20px';
        this.gamePlayDiv.style.backgroundColor = 'rgba(0, 0, 0, 0)';
        this.gamePlayDiv.style.width = '300px';
        this.gamePlayDiv.style.height = '650px';
        this.gamePlayDiv.style.display = 'flex';
        this.gamePlayDiv.style.flexDirection = 'column';

        
        const buttonContainer = document.createElement('div');
        buttonContainer.style.display = 'flex';
        buttonContainer.style.justifyContent = 'space-between';
        buttonContainer.style.marginTop = 'auto'; // I want the buttons at the bottom of the screen
        buttonContainer.style.gap = '10px'; // Spacing between buttons
        
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
        
        this.gamePlayDiv.appendChild(buttonContainer);

        this.gamePlayDiv.style.display = 'none';
        
        this.uiDiv!.appendChild(this.gamePlayDiv);
    }

    updateGameOverScreen(message: string): void {
        if (this.messageElement) {
            this.messageElement.textContent = message;
        }
    }

    updateGameOverSubScreen(message: string): void {
        if (this.subMessageElement) {
            this.subMessageElement.textContent = message;
        }
    }

   toggleMessageScreen(): void {
        if (this.messageScreenDiv) {
            this.messageScreenDiv.style.display = this.messageScreenDiv.style.display === 'none' ? 'flex' : 'none';
        }
    }

    toggleGamePlayScreen(): void {
        if (this.gamePlayDiv) {
            this.gamePlayDiv.style.display = this.gamePlayDiv.style.display === 'none' ? 'flex' : 'none';
        }
    }
}