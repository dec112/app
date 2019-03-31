import { Storage } from '@ionic/storage';
import { Injectable } from '@angular/core';
import { Configuration } from '../models/configuration/configuration';
import { ConfigurationMapper } from '../models/mapper/configurationMapper';
import { AppConfiguration } from '../models/configuration/appConfiguration';
import { UserConfiguration } from '../models/configuration/userConfiguration';
import { SipConfiguration } from '../models/configuration/sipConfiguration';
import { RegistrationInformation } from '../models/configuration/registrationInformation';
import { Subject, Observable } from 'rxjs';

@Injectable()
export class StorageService {
  private configuration: Configuration = null;
  private storageKey: string = 'dec112_cfg';
  private isConfigurationLoaded: boolean = false;

  private configurationLoadedSubject = new Subject<any>();
  private configurationLoadingFailedSubject = new Subject<any>();

  constructor(protected storage: Storage) {}

  public getConfigurationLoadedEvent(): Observable<any> {
    return this.configurationLoadedSubject.asObservable();
  }

  public getConfigurationLoadingFailedEvent(): Observable<any> {
    return this.configurationLoadingFailedSubject.asObservable();
  }

  public getIsConfigurationLoaded() {
    return this.isConfigurationLoaded;
  }

  public save(value: any) {
    this.storage.set(this.storageKey, JSON.stringify(value));
  }

  public getConfiguration(): Configuration {
    return this.configuration;
  }

  private mapConfiguration(value) {
    this.configuration = ConfigurationMapper.map(value);
    this.configurationLoadedSubject.next();
    this.isConfigurationLoaded = true;
  }

  public loadConfiguration() {
    this.storage.get(this.storageKey).then(value => {
      try {
        if (value !== null) {
          this.mapConfiguration(value);
        } else {
          this.configuration = new Configuration(new AppConfiguration(), new UserConfiguration(), new SipConfiguration(), new RegistrationInformation());
          this.configurationLoadedSubject.next();
        }
      } catch (exception) {
        console.log(exception);
        this.configurationLoadingFailedSubject.next();
      }
    });
  }
}
