export default class StandButtonEvent extends Event {
    static readonly EVENT_NAME = "standButton";

    constructor() {
        super(StandButtonEvent.EVENT_NAME);
    }
}