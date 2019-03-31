import { DiagPage } from './../pages/diag/diag';
import { LegalPage } from './../pages/legal/legal';
import { Injectable } from '@angular/core';
import { IconName } from '../constants/iconName';
import { ConfigPage } from '../pages/config/config';
import { MainPage } from '../pages/main/main';
import { HelpPage } from '../pages/help/help';

@Injectable()
export class IconProvider {
  constructor() {}

  getIcon(component: any) {
    switch (component.name) {
      case ConfigPage.name:
        return IconName.SETTINGS;
      case LegalPage.name:
        return IconName.PAPER;
      case MainPage.name:
        return IconName.HOME;
      case DiagPage.name:
        return IconName.INFORMATION_CIRCLE;
        case HelpPage.name:
        return IconName.HELP;
    }
  }
}
