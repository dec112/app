import { Injectable } from "@angular/core";
import { Configuration } from "../models/configuration/configuration";
import { UserConfiguration } from "../models/configuration/userConfiguration";
import { AppConfiguration } from "../models/configuration/appConfiguration";
import { SipConfiguration } from "../models/configuration/sipConfiguration";
import { StorageService } from "./storageService";
import { RegistrationInformation } from "../models/configuration/registrationInformation";

@Injectable()
export class ConfigurationService {
    private configuration: Configuration;
    private defaultConfiguration: Configuration;
    private storageService: StorageService;

    constructor(ss: StorageService) {
        this.defaultConfiguration = new Configuration(new AppConfiguration(), new UserConfiguration(), new SipConfiguration(), new RegistrationInformation());
        this.storageService = ss;
    }

    public saveUserConfiguration(userConfiguration: UserConfiguration) {
        this.configuration.setUserConfiguration(userConfiguration);
        this.storageService.save(this.configuration);
    }

    public saveAppConfiguration(appConfiguration: AppConfiguration) {
        this.configuration.setAppConfiguration(appConfiguration);
        this.storageService.save(this.configuration);
    }

    public saveSipConfiguration(sipConfiguration: SipConfiguration) {
        this.configuration.setSipConfiguration(sipConfiguration);
        this.storageService.save(this.configuration);
    }

    public saveConfiguration(configuaration: Configuration) {
        this.configuration = configuaration;
        this.storageService.save(this.configuration);
    }

    public getConfiguration() {
        this.configuration = this.storageService.getConfiguration();
        if (this.configuration === null) {
            this.configuration = this.defaultConfiguration;
        }
        return this.configuration;
    }

    public resetConfigureation() {
        this.configuration = this.defaultConfiguration;
        this.storageService.save(this.configuration);
    }

    public getDefaultConfiguration(){
        return new Configuration(new AppConfiguration(), new UserConfiguration(), new SipConfiguration(), new RegistrationInformation());
    }
}