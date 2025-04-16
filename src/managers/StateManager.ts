import { DealerState } from '../states/DealerState';
import { DealState } from '../states/DealState';
import { GameOverState } from '../states/GameOverState';
import { IState } from '../states/IState';
import { PlayerState } from '../states/PlayerState';
import { SetupState } from '../states/SetupState';

export enum States {
    SETUP = 'SetupState',
    DEAL = 'DealState',
    PLAYER = 'PlayerState',
    DEALER = 'DealerState',
    GAME_OVER = 'GameOverState'
}

/**
 * @description StateManager is responsible for managing the current state of the game.
 */
export class StateManager {
    private static instance: StateManager | null = null;
    private stateList: IState[] = [new SetupState(), new DealState(), new PlayerState(), new DealerState(), new GameOverState()];
    private currentState: IState | null = null;

    public static getInstance(): StateManager {
        if (StateManager.instance === null) {
            StateManager.instance = new StateManager();
        }
        return StateManager.instance;
    }

    /**
     * @description Changes the current state to the new state and calls the enter method of the new state.
     * @param newState The new state to transition to.
     */
    changeState(stateName: string): void {
        const newState = this.stateList.find(state => state.name === stateName);
        if (newState) {
            if (this.currentState) {
                this.currentState.exit();
            }
            this.currentState = newState;
            this.currentState.enter();
        } else {
            console.error(`State ${stateName} not found`);
        }
    }

    public getCurrentState(): IState | null {
        return this.currentState;
    }

    nextState(): void {
        const currentIndex = this.stateList.indexOf(this.currentState!);
        const nextIndex = (currentIndex + 1) % this.stateList.length;
        this.changeState(this.stateList[nextIndex].name);
    }
}