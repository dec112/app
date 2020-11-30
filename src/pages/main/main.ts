import { SubScriptionManager } from './../../manager/subscriptionManager';
import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, ModalController, NavParams, LoadingController, AlertController, Alert, ToastController, Content } from 'ionic-angular';
import { ConversationPage } from '../conversation/conversation';
import { NetworkService } from '../../services/networkService';
import { SipService } from '../../services/sipService';
import { ConfigurationService } from '../../services/configurationService';
import { ConfigPage } from '../config/config';
import { StorageService } from '../../services/storageService';
import { NavigationParameter } from '../../constants/navigationParameter';
import { LocalizationProperty } from '../../constants/localizationProperty';
import { ToastStatus } from '../../constants/toastStatus';
import { UserConfiguration } from '../../models/configuration/userConfiguration';
import { CallTarget } from '../../constants/callTarget';
import { Target } from '../../models/target';
import { LegalPage } from '../legal/legal';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { MenuVisibilityManager } from '../../manager/menuVisibilityManager';
import { ViewManager } from '../../manager/viewManager';

@Component({
  selector: 'page-mainPage',
  templateUrl: 'main.html',
})
export class MainPage {
  @ViewChild('content')
  content: Content;

  private alert: Alert;
  private subscriptions: Array<Subscription>;

  public callInfoRead: boolean = false;
  public testModeEnabled: boolean = false;

  constructor(
    protected navController: NavController,
    protected navParams: NavParams,
    protected networkService: NetworkService,
    protected sipService: SipService,
    protected configurationService: ConfigurationService,
    protected modalController: ModalController,
    protected storageService: StorageService,
    protected loadingController: LoadingController,
    protected translate: TranslateService,
    protected alertController: AlertController,
    protected toastController: ToastController,
    protected subscriptionManager: SubScriptionManager,
    protected menuVisibilityManager: MenuVisibilityManager,
    protected viewManager: ViewManager
  ) {
    this.subscriptions = new Array<Subscription>();
    this.initListener();
  }

  public ionViewWillLeave() {
    this.subscriptionManager.unsubscribe(this.subscriptions);
  }

  public ionViewDidEnter() {
    this.initConfiguration();
    this.content.setElementStyle('height', `${this.content.contentHeight - this.viewManager.getFooterElementHeight()}px`);
  }

  public initListener() {
    this.subscriptions.push(
      this.networkService.getNetworkDisconnectedEvent().subscribe(evt => {
        this.showToastMessage(this.translate.instant(LocalizationProperty.NETWORK_DISCONNECTED.toString()), ToastStatus.ERROR);
      })
    );
    this.subscriptions.push(
      this.networkService.getNetworkConnectedEvent().subscribe(evt => {
        this.showToastMessage(this.translate.instant(LocalizationProperty.NETWORK_CONNECTED.toString()), ToastStatus.SUCCESS);
      })
    );
  }

  public startEmergencyCall(target: string) {
    if (this.networkService.isNetworkAvailable()) {
      this.sipService.setCurrentCallTarget(this.getCallTarget(target));
      this.menuVisibilityManager.hideMenu();
      this.navController.setRoot(ConversationPage);
    } else {
      //this.navController.setRoot(ConversationPage, { sendViaSMS: true });
    }
  }

  public initConfiguration() {
    this.subscriptions.push(
      this.storageService.getConfigurationLoadedEvent().subscribe(evt => {
        this.handleNavigationParameter();
      })
    );
  }

  public onCallInfoReadClick() {
    let configuration = this.configurationService.getConfiguration();
    configuration.setCallInfoRead(true);
    this.configurationService.saveConfiguration(configuration);
    this.callInfoRead = this.configurationService.getConfiguration().getCallInfoRead();
  }

  public handleTestModeChange (){
    this.testModeEnabled = !this.testModeEnabled;
  }

  private handleNavigationParameter() {
    var showConfigDialog = this.navParams.get(NavigationParameter.SHOW_CONFIG_DIALOG.toString());
    if (showConfigDialog !== undefined) {
      this.navController.setRoot(ConfigPage);
    } else {
      if (!this.configurationService.getConfiguration().isConfiguredByUser()) {
        if (this.configurationService.getConfiguration().getLegalAccepted()) {
          this.navController.setRoot(ConfigPage);
        } else if (!this.configurationService.getConfiguration().getLegalAccepted()) {
          this.navController.setRoot(LegalPage);
        } else if (
          this.configurationService
            .getConfiguration()
            .getRegistrationInformation()
            .getPendingRegistration()
        ) {
          this.menuVisibilityManager.hideMenu();
        }
      }
      this.callInfoRead = this.configurationService.getConfiguration().getCallInfoRead();
    }
  }

  private getCallTarget(name: string): string {
    var userConfiguration: UserConfiguration = this.configurationService.getConfiguration().getUserConfiguration();
    var target: Target = userConfiguration.getTarget(CallTarget[name]);
    return target.getPublicIdentity();
  }

  private presentModal(page: any) {
    let modal = this.modalController.create(page, { showMenu: false });
    modal.present();
  }

  private presentAlert() {
    this.alert = this.alertController.create({
      title: this.translate.instant(LocalizationProperty.NO_CONFIGURATION.toString()),
      subTitle: this.translate.instant(LocalizationProperty.CONFIGURATION_NEEDED.toString()),
      buttons: [this.translate.instant(LocalizationProperty.OK.toString())],
    });
    this.alert.present();
  }

  private showToastMessage(message: string, status: ToastStatus) {
    let toast = this.toastController.create({
      message: message,
      duration: 3000,
      position: 'bottom',
      cssClass: 'networkToast ' + status.toString(),
      showCloseButton: true,
      dismissOnPageChange: true,
    });
    toast.present(toast);
  }
}
