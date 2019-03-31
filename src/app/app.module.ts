import { ViewManager } from './../manager/viewManager';
import { PositionService } from './../services/positionService';
import { ConnectingPage } from './../pages/modal/connecting/connecting';
import { SubScriptionManager } from './../manager/subscriptionManager';
import { IconProvider } from '../provider/iconProvider';
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule, Keyboard } from 'ionic-angular';

import { MyApp } from './app.component';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { TranslateModule, TranslateLoader, TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpModule } from '@angular/http';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { ConversationPage } from '../pages/conversation/conversation';
import { SipService } from '../services/sipService';
import { MainPage } from '../pages/main/main';
import { DiagPage } from '../pages/diag/diag';
import { LegalPage } from '../pages/legal/legal';
import { ConfigPage } from '../pages/config/config';
import { SuggestionsPage } from '../pages/modal/suggestions/suggestions';
import { ChatBubble } from '../components/chatBubble';
import { StorageService } from '../services/storageService';
import { ConfigurationValidationService } from '../services/configurationValidationService';
import { ConfigurationService } from '../services/configurationService';
import { MessageService } from '../services/messageService';
import { ConversationManager } from '../manager/conversationManager';
import { NetworkService } from '../services/networkService';
import { HealthKitManager } from '../manager/healthKitManager';
import { HealthKit } from '@ionic-native/health-kit';
import { TimerManager } from '../manager/timerManager';
import { Insomnia } from '@ionic-native/insomnia';
import { ThreeDeeTouch } from '@ionic-native/three-dee-touch';
import { AppVersion } from '@ionic-native/app-version';
import { Network } from '@ionic-native/network';
import { IonicStorageModule } from '@ionic/storage';
import { Device } from '@ionic-native/device';
import { Geolocation } from '@ionic-native/geolocation';
import { DebugModeManager } from './../manager/debugModeManager';
import { MenuVisibilityManager } from '../manager/menuVisibilityManager';
import { HelpPage } from '../pages/help/help';

@NgModule({
  declarations: [MyApp, MainPage, ConversationPage, DiagPage, LegalPage, ConfigPage, SuggestionsPage, ConnectingPage, HelpPage, ChatBubble],
  imports: [
    BrowserModule,
    HttpModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp, { statusbarPadding: true }),
    IonicStorageModule.forRoot({
      name: '__dec112Storage',
      driverOrder: ['indexeddb', 'sqlite', 'websql'],
    }),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
  ],
  bootstrap: [IonicApp],
  entryComponents: [MyApp, MainPage, ConversationPage, DiagPage, LegalPage, ConfigPage, SuggestionsPage, HelpPage, ConnectingPage],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    SipService,
    HealthKitManager,
    HealthKit,
    TimerManager,
    Insomnia,
    Keyboard,
    AppVersion,
    ThreeDeeTouch,
    Network,
    Device,
    StorageService,
    ConfigurationValidationService,
    ConfigurationService,
    MessageService,
    ConversationManager,
    PositionService,
    NetworkService,
    IconProvider,
    SubScriptionManager,
    DebugModeManager,
    MenuVisibilityManager,
    ViewManager,
    Geolocation,
  ],
})
export class AppModule {
  constructor(protected ts: TranslateService) {
    ts.setDefaultLang('de');
    ts.use(navigator.language.toLocaleLowerCase());
  }
}

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}
