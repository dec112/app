import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable()
export class MenuVisibilityManager {
  private menuVisible = true;
  private menuVisibleSubject = new Subject<boolean>();

  constructor() {}

  public getMenuVisibilityChangedEvent(): Observable<boolean> {
    return this.menuVisibleSubject.asObservable();
  }

  public isMenuVisible() {
    return this.menuVisible;
  }

  public showMenu() {
    this.menuVisible = true;
    this.menuVisibleSubject.next(true);
  }

  public hideMenu() {
    this.menuVisible = false;
    this.menuVisibleSubject.next(false);
  }
}
