import { DebugModeManager } from './../../manager/debugModeManager';
import { ConfigurationService } from '../../services/configurationService';
import { UserConfiguration } from '../../models/configuration/userConfiguration';
import { SipConfiguration } from '../../models/configuration/sipConfiguration';
import { MainPage } from '../main/main';
import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, ViewController, AlertController, Content } from 'ionic-angular';
import { Configuration } from '../../models/configuration/configuration';
import { AdditionalInformation } from '../../models/configuration/additionalInformation';
import { ConfigurationValidationService } from '../../services/configurationValidationService';
import { StorageService } from '../../services/storageService';
import { LocalizationProperty } from '../../constants/localizationProperty';
import { HealthKitManager } from '../../manager/healthKitManager';
import * as sha1 from 'js-sha1';
import { TranslateService } from '@ngx-translate/core';
import { Device } from '@ionic-native/device';
import { Subscription } from 'rxjs';
import { MenuVisibilityManager } from '../../manager/menuVisibilityManager';
import { ViewManager } from '../../manager/viewManager';

@Component({
  selector: 'page-configPage',
  templateUrl: 'config.html',
})
export class ConfigPage {
  @ViewChild('content') content: Content;
  
  headerHidden = false;
  private configuration: Configuration;
  private userConfiguration: UserConfiguration;
  private sipConfiguration: SipConfiguration;
  private additionalDataKey = '';
  private additionalDataValue = '';

  private isZipCodeValid: boolean = false;
  private isEmailValid: boolean = false;
  private isFirstNameValid: boolean = false;
  private isLastNameValid: boolean = false;
  private isPhoneValid: boolean = false;
  private debugModeEnabled: boolean = false;
  private debugModeEnabledSubScription: Subscription;
  private menuVisibilityChangedSubscription:Subscription;

  constructor(
    protected navController: NavController,
    protected navParams: NavParams,
    protected translate: TranslateService,
    protected configurationService: ConfigurationService,
    protected viewController: ViewController,
    protected configurationValidationService: ConfigurationValidationService,
    protected alertController: AlertController,
    protected storageService: StorageService,
    protected healthKitManager: HealthKitManager,
    protected device: Device,
    protected debugModeManager: DebugModeManager,
    protected menuVisibilityManager:MenuVisibilityManager,
    protected viewManager:ViewManager
  ) {
    this.headerHidden = this.menuVisibilityManager.isMenuVisible();
    this.getInitialConfiguration();
    this.debugModeEnabled = this.debugModeManager.isDebugModeEnabled();
    this.debugModeEnabledSubScription = this.debugModeManager.getDebugModeChangedEvent().subscribe(value => {
      this.debugModeEnabled = value;
    });
    this.menuVisibilityChangedSubscription = this.menuVisibilityManager.getMenuVisibilityChangedEvent().subscribe(visible =>{
      this.headerHidden = visible;
    });
  }

  public ionViewWillLeave() {
    this.debugModeEnabledSubScription.unsubscribe();
    this.menuVisibilityChangedSubscription.unsubscribe();
  }

  public ionViewDidEnter(){
    if(this.headerHidden){
      this.content.setElementStyle('height', `${this.content.contentHeight - this.viewManager.getFooterElementHeight()}px`);
    }
  }

  public onSaveConfigClick() {
    if (!this.isConfigurationValid()) {
      this.presentConfigurationInvalidAlert();
    }
    this.configuration.setUserConfiguration(this.userConfiguration);
    this.configuration.setSipConfiguration(this.sipConfiguration);
    this.configuration.setIsConfiguredByUser(true);
    this.configurationService.saveConfiguration(this.configuration);
    this.menuVisibilityManager.showMenu();
    this.navController.setRoot(MainPage);
  }

  public isDebugModeEnabled() {
    return this.debugModeEnabled;
  }

  public onResetClick() {
    this.presentClearConfigurationConfirm();
  }

  public setAdditionalDataValue(value: string) {
    this.additionalDataValue = value;
  }

  public setAdditionalDataKey(value: string) {
    this.additionalDataKey = value;
  }

  public addAdditionalData() {
    if (this.additionalDataKey.trim() !== '' && this.additionalDataValue.trim() !== '') {
      var entry: AdditionalInformation = new AdditionalInformation(this.additionalDataKey, this.additionalDataValue);
      this.configuration.getUserConfiguration().addAdditionalInformation(entry);
      this.configurationService.saveConfiguration(this.configuration);
      this.additionalDataKey = '';
      this.additionalDataValue = '';
    }
  }

  public deleteAdditionalInformation(key: string) {
    this.userConfiguration.deleteAdditionalInformation(key);
    this.configuration.setUserConfiguration(this.userConfiguration);
    this.storageService.save(this.configuration);
  }

  private resetConfiguration() {
    this.configurationService.resetConfigureation();
    this.menuVisibilityManager.hideMenu();
    this.navController.setRoot(MainPage);
  }

  private getInitialConfiguration() {
      this.configuration = this.configurationService.getConfiguration();
      this.userConfiguration = this.configuration.getUserConfiguration();
      this.sipConfiguration = this.configuration.getSipConfiguration();
      this.validateInitialData();
  }

  private validateInitialData() {
    this.validateZipCode(this.userConfiguration.getZipCode());
    this.validateEmail(this.userConfiguration.getEmail());
    this.validateFirstName(this.userConfiguration.getFirstName());
    this.validateLastName(this.userConfiguration.getLastName());
    this.validatePhone(this.userConfiguration.getPhoneNumber());
  }

  private validateZipCode(zipCode: number) {
    this.isZipCodeValid = false;
    if(zipCode){
      this.isZipCodeValid = this.configurationValidationService.isZipCodeValid(zipCode.toString());
    }
    if (this.isZipCodeValid) {
      this.userConfiguration.setZipCode(zipCode);
    }
  }

  private validateEmail(email: string) {
    this.isEmailValid = this.configurationValidationService.isEmailValid(email);
    if (this.isEmailValid) {
      this.userConfiguration.setEmail(email);
    }
  }

  private validateFirstName(name: string) {
    this.isFirstNameValid = this.configurationValidationService.isValidName(name);
    if (this.isFirstNameValid) {
      this.userConfiguration.setFirstName(name);
    }
  }

  private validateLastName(name: string) {
    this.isLastNameValid = this.configurationValidationService.isValidName(name);
    if (this.isLastNameValid) {
      this.userConfiguration.setLastName(name);
    }
  }

  private validatePhone(phone: string) {
    this.isPhoneValid = this.configurationValidationService.isValidPhone(phone);
    if (this.isPhoneValid) {
      this.userConfiguration.setPhoneNumber(phone);
    }
  }

  private isConfigurationValid() {
    return this.isEmailValid && this.isZipCodeValid && this.isPhoneValid && this.isFirstNameValid && this.isLastNameValid;
  }

  private presentConfigurationInvalidAlert() {
    let alert = this.alertController.create({
      title: this.translate.instant(LocalizationProperty.INVALID_CONFIGURATION.toString()),
      subTitle: this.translate.instant(LocalizationProperty.INVALID_CONFIGURATION_MESSAGE.toString()),
      buttons: [this.translate.instant(LocalizationProperty.OK.toString())],
    });
    alert.present();
  }

  private presentClearConfigurationConfirm() {
    let alert = this.alertController.create({
      title: this.translate.instant(LocalizationProperty.RESET.toString()),
      message: this.translate.instant(LocalizationProperty.RESET_TT.toString()),
      buttons: [
        {
          text: this.translate.instant(LocalizationProperty.NO.toString()),
          role: 'cancel',
        },
        {
          text: this.translate.instant(LocalizationProperty.YES.toString()),
          handler: () => {
            this.resetConfiguration();
          },
        },
      ],
    });
    alert.present();
  }

  private deviceNotRegistered() {
    var alreadyRegistered = this.configuration.getRegistrationInformation().getIsRegistered();
    var pendingRegistration = this.configuration.getRegistrationInformation().getPendingRegistration();
    var hasDifferendPhoneNumber = this.configuration.getRegistrationInformation().getRegisteredPhoneNumber() !== this.userConfiguration.getPhoneNumber();
    var hasDifferentEmail = this.configuration.getRegistrationInformation().getRegisteredEmail() !== this.userConfiguration.getEmail();
    return (hasDifferendPhoneNumber || hasDifferentEmail) && !pendingRegistration && !alreadyRegistered;
  }
}
