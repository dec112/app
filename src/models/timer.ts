import { TimerIdentifier } from '../constants/timerIdentifier';

export class Timer {
  private timer: any;
  private identifier: TimerIdentifier;

  constructor(timer: any, identifier: TimerIdentifier) {
    this.timer = timer;
    this.identifier = identifier;
  }

  public getTimer(): any {
    return this.timer;
  }

  public getIdentifier(): TimerIdentifier {
    return this.identifier;
  }
}
