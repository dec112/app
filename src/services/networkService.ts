import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import { NetworkState } from '../constants/networkState';
import { TranslateService } from '@ngx-translate/core';
import { Network } from '@ionic-native/network';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class NetworkService {
  private networkState: string = 'unknown';
  private disconnectSubscription = null;
  private connectSubscription = null;
  private networkTypeChangeSubscription = null;
  private networkStates = {
    wifi: 'CONNECTION_WIFI',
    '2g': 'CONNECTION_CELL_2G',
    '3g': 'CONNECTION_CELL_3G',
    '4g': 'CONNECTION_CELL_4G',
    cellular: 'CONNECTION_CELL',
    none: 'CONNECTION_NONE',
    unknown: 'CONNECTION_UNKNOWN',
    ethernet: 'CONNECTION_ETHERNET',
  };

  constructor(protected translate: TranslateService, protected platform: Platform, protected network: Network) {
    if (!platform.is('core')) {
      platform.ready().then(() => {
        this.updateNetworkState(this.network.type);
        this.initNetworkListeners();
      });
    }
  }

  private networkConnectedSubject = new Subject<any>();
  private networkDisconnectedSuject = new Subject<any>();
  private networkChangedSubject = new Subject<any>();

  public getNetworkConnectedEvent(): Observable<any> {
    return this.networkConnectedSubject.asObservable();
  }

  public getNetworkDisconnectedEvent(): Observable<any> {
    return this.networkDisconnectedSuject.asObservable();
  }

  public getNetworkChangedEvent(): Observable<any> {
    return this.networkChangedSubject.asObservable();
  }

  public isNetworkAvailable() {
    return this.networkState !== NetworkState.CONNECTION_NONE.toString();
  }

  public getState() {
    return this.translate.instant(this.networkStates[this.networkState]);
  }

  private updateNetworkState(state) {
    if (state) {
      this.networkState = state;
    } else {
      this.networkState = 'unknown';
    }
  }

  private initNetworkListeners() {
    if (this.disconnectSubscription == null) {
      this.disconnectSubscription = this.network.onDisconnect().subscribe(() => {
        this.notifyNetworkDisconnected();
      });
    }
    if (this.connectSubscription == null) {
      this.connectSubscription = this.network.onConnect().subscribe(() => {
        this.notifyNetworkConnected();
      });
    }
    if (this.networkTypeChangeSubscription == null) {
      this.networkTypeChangeSubscription = this.network.onchange().subscribe(() => {
        this.notifyNetworkStateChanged();
      });
    }
  }

  private notifyNetworkConnected() {
    this.updateNetworkState(this.network.type);
    this.networkConnectedSubject.next();
  }

  private notifyNetworkDisconnected() {
    this.updateNetworkState(this.network.type);
    this.networkDisconnectedSuject.next();
  }

  private notifyNetworkStateChanged() {
    this.updateNetworkState(this.network.type);
    this.networkChangedSubject.next();
  }
}
