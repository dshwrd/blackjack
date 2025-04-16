/**
 * Interface for a state in the state machine.
 */
export interface IState {
    name: string;
    enter(): void;
    exit(): void;
}