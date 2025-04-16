export default class HitButtonEvent extends Event {
    static readonly EVENT_NAME = "hitButton";

    constructor() {
        super(HitButtonEvent.EVENT_NAME);
    }
}