import { DebugModeManager } from './../../manager/debugModeManager';
import { ViewManager } from './../../manager/viewManager';
import { LegalPage } from './../legal/legal';
import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, ModalController, Content } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { LocalizationProperty } from '../../constants/localizationProperty';

@Component({
  selector: 'page-helpPage',
  templateUrl: 'help.html',
})
export class HelpPage {
  @ViewChild('content')
  content: Content;

  public developer = 'Fill In Developer';
  public contactEmail = 'fillin@contact.doe';
  public appVersion = '0.0.1';
  public pages = [{ title: LocalizationProperty.LEGAL, component: LegalPage }];
  private debugModeClickCounter: number = 0;

  constructor(
    protected navController: NavController,
    protected navParams: NavParams,
    protected translateService: TranslateService,
    protected modalController: ModalController,
    protected viewManager: ViewManager,
    protected debugModeManager: DebugModeManager
  ) {
    this.debugModeClickCounter = 0;
  }

  public openModal(page) {
    let modal = this.modalController.create(page.component, { showBackButton: true });
    modal.present();
  }

  public ionViewDidEnter() {
    this.content.setElementStyle('height', `${this.content.contentHeight - this.viewManager.getFooterElementHeight()}px`);
  }

  public onAppVersionClick() {
    this.debugModeClickCounter++;
    if (this.debugModeClickCounter === 10 && !this.debugModeManager.isDebugModeEnabled()) {
      this.debugModeManager.enableDebugMode();
      this.debugModeClickCounter = 0;
    }
  }
}
