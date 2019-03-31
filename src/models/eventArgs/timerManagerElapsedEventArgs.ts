import { TimerIdentifier } from "../../constants/timerIdentifier";

export class TimerManagerElapsedEventArgs {
    private _identifier: TimerIdentifier;
 
    constructor(identifier: TimerIdentifier) {
        this._identifier = identifier;
    }

    get identifier(): TimerIdentifier {
        return this._identifier;
    }
}