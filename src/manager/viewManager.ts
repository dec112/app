import { Injectable, ElementRef } from '@angular/core';

@Injectable()
export class ViewManager {
  private globalFooterElement: ElementRef;

  constructor() {}

  public setGlobalFooterElement(globalFooterElement: ElementRef) {
    this.globalFooterElement = globalFooterElement;
  }

  public getFooterElement() {
    return this.globalFooterElement;
  }

  public getFooterElementHeight() {
    if (this.globalFooterElement && this.globalFooterElement.nativeElement) {
      return this.globalFooterElement.nativeElement.clientHeight;
    }
    return 0;
  }
}
