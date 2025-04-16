import StartGameEvent from '../events/StartGameEvent';
import { Deck } from '../game/cards/Deck';
import { Game } from '../game/Game';
import { Player } from '../game/player/Player';
import { StateManager } from '../managers/StateManager';
import { BlackJackScence } from '../ui/BlackJackScene';
import { IState } from './IState';

/**
 * @description State that setups the game. Pretty basic.
 */
export class SetupState implements IState {
    public name: string = 'SetupState';
    private gameSetup: boolean = false;

    constructor() {
        this.startGame = this.startGame.bind(this);
    }

    public enter(): void {
        console.log('Entering Setup State');
        if (!this.gameSetup) {
            Game.getInstance().setDeck(new Deck());
            Game.getInstance().setPlayer(new Player());
            Game.getInstance().setDealer(new Player());
            this.gameSetup = true;
        }
        
        Game.getInstance().resetGame();
        BlackJackScence.getInstance().toggleMessageScreen();
        BlackJackScence.getInstance().updateGameOverScreen('Welcome to Blackjack!');
        BlackJackScence.getInstance().updateGameOverSubScreen('A Code Test by Dan H.');

        document.addEventListener(StartGameEvent.EVENT_NAME, this.startGame);
    }

    public startGame(event: Event): void {
        StateManager.getInstance().nextState();
    }

    public exit(): void {
        console.log('Exiting Setup State');
        document.removeEventListener(StartGameEvent.EVENT_NAME, this.startGame);
    }
}