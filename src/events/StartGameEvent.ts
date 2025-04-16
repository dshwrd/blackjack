export default class GameStartEvent extends Event {
    static readonly EVENT_NAME = "gameStart";

    constructor() {
        super(GameStartEvent.EVENT_NAME);
    }
}