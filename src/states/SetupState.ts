import StartGameEvent from '../events/StartGameEvent';
import { Deck } from '../game/cards/Deck';
import { Game } from '../game/Game';
import { Player } from '../game/player/Player';
import { StateManager } from '../managers/StateManager';
import { UIScene } from '../ui/UIScene';
import { IState } from './IState';

/**
 * @description State that sets up the game. Pretty basic.
 */
export class SetupState implements IState {
    public name: string = 'SetupState';
    private gameSetup: boolean = false;

    constructor() {
        // Bind the startGame method to the current instance
        // This is necessary because the method is passed as a callback and needs to maintain the correct context.
        this.startGame = this.startGame.bind(this);
    }

    public enter(): void {
        console.log('Entering Setup State');
        // First time entering this state, generate the deck, player, and dealer
        if (!this.gameSetup) {
            Game.getInstance().setDeck(new Deck());
            Game.getInstance().setPlayer(new Player());
            Game.getInstance().setDealer(new Player());
            this.gameSetup = true;
        }
        
        // Reset the game and set up the UI
        Game.getInstance().resetGame();
        UIScene.getInstance().toggleMessageScreen();
        UIScene.getInstance().updateGameOverScreen('Welcome to Blackjack!');
        UIScene.getInstance().updateGameOverSubScreen('A Code Test by Dan H.');

        // Listening for the start game event, which is sent from the New Game button
        document.addEventListener(StartGameEvent.EVENT_NAME, this.startGame);
    }

    /**
     * @description The StartGameEvent was triggered, so let's move to the next state (Deal State)
     * @param event StateGameEvent
     */
    public startGame(event: Event): void {
        console.log('StartGameEvent: ' + event.type);
        StateManager.getInstance().nextState();
    }

    /**
     * @description Exiting the state, cleaning up StartGameEvent listener.
     */
    public exit(): void {
        console.log('Exiting Setup State');
        document.removeEventListener(StartGameEvent.EVENT_NAME, this.startGame);
    }
}