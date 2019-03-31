import { HelpPage } from './../pages/help/help';
import { DebugModeManager } from './../manager/debugModeManager';
import { IconProvider } from '../provider/iconProvider';
import { Component, ViewChild, ElementRef } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { MainPage } from '../pages/main/main';
import { TranslateService } from '@ngx-translate/core';
import { LocalizationProperty } from '../constants/localizationProperty';
import { ConfigPage } from '../pages/config/config';
import { DiagPage } from '../pages/diag/diag';
import { LegalPage } from '../pages/legal/legal';
import { ThreeDeeTouch } from '@ionic-native/three-dee-touch';
import { StorageService } from '../services/storageService';
import { ConfigurationService } from '../services/configurationService';
import { PositionService } from '../services/positionService';
import { MenuVisibilityManager } from '../manager/menuVisibilityManager';
import { ViewManager } from '../manager/viewManager';

@Component({
  templateUrl: 'app.html',
})
export class MyApp {
  @ViewChild(Nav)nav: Nav;
  @ViewChild('footer') footer: ElementRef;
  @ViewChild('content') content: ElementRef;

  rootPage: any = MainPage;
  currentPage: any = MainPage;
  debugModeClickCounter = 0;
  menuVisible = false;

  pages: Array<{ title: string; component: any }>;

  constructor(
    protected platform: Platform,
    protected statusBar: StatusBar,
    protected splashScreen: SplashScreen,
    protected translate: TranslateService,
    protected threeDeeTouch: ThreeDeeTouch,
    protected storageService: StorageService,
    protected configurationService: ConfigurationService,
    protected iconProvider: IconProvider,
    protected debugModeManager: DebugModeManager,
    protected positionService: PositionService,
    protected menuVisibilityManager:MenuVisibilityManager,
    protected viewManager:ViewManager
  ) {
    this.updatePages();
    this.initializeApp();
  }

  private updatePages() {
    this.pages = [{ title: LocalizationProperty.HOME, component: MainPage }, { title: LocalizationProperty.SETTINGS, component: ConfigPage }, { title: LocalizationProperty.HELP, component: HelpPage }];
    if (this.debugModeManager.isDebugModeEnabled()) {
      this.pages.push({ title: LocalizationProperty.DIAG, component: DiagPage });
    }
  }

  private initializeApp() {
    this.platform.ready().then(() => {
      this.viewManager.setGlobalFooterElement(this.footer);
      this.positionService.start();
      this.statusBar.overlaysWebView(false);
      this.updatePages();

      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.storageService.getConfigurationLoadedEvent().subscribe(evt => {
        this.splashScreen.hide();
        if (!this.configurationService.getConfiguration().isConfiguredByUser()) {
          if (!this.configurationService.getConfiguration().getLegalAccepted()) {
            this.menuVisibilityManager.hideMenu();
            this.nav.setRoot(LegalPage);
          } else {
            this.menuVisibilityManager.hideMenu();
           this.nav.setRoot(ConfigPage);
          }
        }
        this.checkConfiguration();
      });
      this.statusBar.backgroundColorByHexString('#B1CFBC');
      this.storageService.getConfigurationLoadingFailedEvent().subscribe(evt => {
        console.log('configuration loaded failed');
        // TODO: present dialog and tell user to restart the app
        //Splashscreen.hide();
      });
      this.debugModeManager.getDebugModeChangedEvent().subscribe(enabled => {
        this.updatePages();
      });
      this.menuVisibilityManager.getMenuVisibilityChangedEvent().subscribe(visible =>{
        this.menuVisible = visible;
      });
      this.menuVisible = this.menuVisibilityManager.isMenuVisible();
      this.storageService.loadConfiguration();
    });
  }

  onDebugModeClick() {
    this.debugModeManager.disableDebugMode();
  }

  public isDebugModeEnabled() {
    return this.debugModeManager.isDebugModeEnabled();
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.menuVisibilityManager.showMenu();
    this.currentPage = page.component;
    this.nav.setRoot(page.component);
  }

  private initThreeDeeTouch() {
    this.threeDeeTouch.isAvailable().then(isAvailable => {
      if (isAvailable) {
        this.threeDeeTouch.onHomeIconPressed().subscribe(payload => {
          // navigate to Main Page and start conversation
          //this.pubSubService.emitHomeIconPressedEvent(payload);
        });
      }
    });
  }

  private checkConfiguration(){
    
  }
}
