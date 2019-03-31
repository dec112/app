import { Injectable } from "@angular/core";
import { TimerIdentifier } from "../constants/timerIdentifier";
import { Timer } from "../models/timer";
import { TimerManagerElapsedEventArgs } from "../models/eventArgs/timerManagerElapsedEventArgs";
import { Subject, Observable } from "rxjs";

@Injectable()
export class TimerManager {
    private timer: Array<Timer> = [];
    private timerElapsedSubject = new Subject<any>();

    constructor() {
    }

    public getTimerElapsedEvent():Observable<any>{
        return this.timerElapsedSubject.asObservable();
    }

    public setTimeout(identifier: TimerIdentifier, duration: number) {
        if (!this.containsTimer(identifier)) {
            var timeout = setTimeout(() => {
                this.removeTimeout(identifier);
            }, parseInt(duration.toString()));
            this.timer.push(new Timer(timeout, identifier));
        }
    }

    public stopTimeout(identifier: TimerIdentifier, duration: number) {
        this.removeTimeout(identifier);
    }

    public setInterval(identifier: TimerIdentifier, duration: number) {
        if (!this.containsTimer(identifier)) {
            var interval = setInterval(() => {
                this.timerElapsedSubject.next(new TimerManagerElapsedEventArgs(identifier));
            }, parseInt(duration.toString()));
            this.timer.push(new Timer(interval, identifier));
        }
    }

    public stopInterval(identifier: TimerIdentifier) {
        this.removeInterval(identifier);
    }

    private removeInterval(identifier: TimerIdentifier) {
        for (var i = 0; i < this.timer.length; i++) {
            if (this.timer[i].getIdentifier() === identifier) {
                clearInterval(this.timer[i].getTimer());
            }
        }
    }

    private removeTimeout(identifier: TimerIdentifier) {
        for (var i = 0; i < this.timer.length; i++) {
            if (this.timer[i].getIdentifier() === identifier) {
                clearTimeout(this.timer[i].getTimer());
            }
        }
    }

    private containsTimer(identifier: TimerIdentifier) {
        var containsInterval = false;
        for (var i = 0; i < this.timer.length; i++) {
            if (this.timer[i].getIdentifier() === identifier) {
                containsInterval = true;
            }
        }
        return containsInterval;
    }
}