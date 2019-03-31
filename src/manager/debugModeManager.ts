import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable()
export class DebugModeManager {
  private debugModeEnabled = false;
  private debugModeChangedSubject = new Subject<boolean>();

  constructor() {}

  public getDebugModeChangedEvent(): Observable<boolean> {
    return this.debugModeChangedSubject.asObservable();
  }

  public isDebugModeEnabled() {
    return this.debugModeEnabled;
  }

  public enableDebugMode() {
    this.debugModeEnabled = true;
    this.debugModeChangedSubject.next(true);
  }

  public disableDebugMode() {
    this.debugModeEnabled = false;
    this.debugModeChangedSubject.next(false);
  }
}
