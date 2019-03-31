import { DebugModeManager } from './../../manager/debugModeManager';
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ConfigurationService } from '../../services/configurationService';
import { ConfigPage } from '../config/config';
import { TranslateService } from '@ngx-translate/core';
import { MenuVisibilityManager } from '../../manager/menuVisibilityManager';
import { Subscription } from 'rxjs';
import { ViewController } from 'ionic-angular';

@Component({
  selector: 'page-legalPage',
  templateUrl: 'legal.html',
})
export class LegalPage {
  public headerHidden = false;
  public backButtonHidden = false;
  public legalAccepted: boolean = false;
  private menuVisibilityChangedSubscription: Subscription;

  constructor(
    protected navController: NavController,
    protected navParams: NavParams,
    protected translateService: TranslateService,
    protected configurationService: ConfigurationService,
    protected debugModeManager: DebugModeManager,
    protected menuVisibilityManager: MenuVisibilityManager,
    protected viewController: ViewController
  ) {
    this.headerHidden = this.menuVisibilityManager.isMenuVisible();
    this.backButtonHidden = !this.menuVisibilityManager.isMenuVisible();
    this.legalAccepted = this.configurationService.getConfiguration().getLegalAccepted();
    this.menuVisibilityChangedSubscription = this.menuVisibilityManager.getMenuVisibilityChangedEvent().subscribe(visible => {
      this.headerHidden = visible;
    });
    this.handleNavigationParameter(navParams);
  }

  public ionViewWillLeave() {
    this.menuVisibilityChangedSubscription.unsubscribe();
  }

  public acceptLegal() {
    this.configurationService.getConfiguration().setLegalAccepted(true);
    this.configurationService.saveConfiguration(this.configurationService.getConfiguration());
    this.menuVisibilityManager.hideMenu();
    this.navController.setRoot(ConfigPage);
  }

  public declineLegal() {
      this.legalAccepted = false;
      this.configurationService.saveConfiguration(this.configurationService.getDefaultConfiguration());
      this.debugModeManager.disableDebugMode();
      this.menuVisibilityManager.hideMenu();
      this.navController.setRoot(LegalPage);
  }

  public onBackButtonClick() {
    this.viewController.dismiss();
  }

  private handleNavigationParameter(params: NavParams) {
    const showBackButton = params.get('showBackButton');
    if (showBackButton) {
      this.backButtonHidden = !showBackButton;
    }
  }
}
