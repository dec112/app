import { UserConfiguration } from './userConfiguration';
import { AppConfiguration } from './appConfiguration'
import { SipConfiguration } from "./sipConfiguration";
import { RegistrationInformation } from './registrationInformation';

export class Configuration {

    private appConfiguration: AppConfiguration;
    private userConfiguration: UserConfiguration;
    private sipConfiguration: SipConfiguration;
    private registrationInformation: RegistrationInformation;
    private isConfigured: boolean = false;
    private legalAccepted: boolean = false;
    private callInfoRead:boolean = false;

    constructor(ac: AppConfiguration, uc: UserConfiguration, sc: SipConfiguration, ri:RegistrationInformation) {
        this.appConfiguration = ac;
        this.userConfiguration = uc;
        this.sipConfiguration = sc;
        this.registrationInformation = ri;
    }

    public getAppConfiguration() {
        return this.appConfiguration;
    }

    public setAppConfiguration(appConfiguration: AppConfiguration) {
        this.appConfiguration = appConfiguration;
    }

    public getUserConfiguration() {
        return this.userConfiguration;
    }

    public setUserConfiguration(userConfiguration: UserConfiguration) {
        this.userConfiguration = userConfiguration;
    }

    public getSipConfiguration() {
        return this.sipConfiguration;
    }

    public setSipConfiguration(sipConfiguration: SipConfiguration) {
        this.sipConfiguration = sipConfiguration;
    }

    public isConfiguredByUser() {
        return this.isConfigured
    }

    public setIsConfiguredByUser(isConfigured:boolean){
        this.isConfigured = isConfigured;
    }

    public getLegalAccepted():boolean{
        return this.legalAccepted;
    }

    public setLegalAccepted(legalAccepted:boolean){
        this.legalAccepted = legalAccepted
    }

    public getCallInfoRead(){
        return this.callInfoRead;
    }

    public setCallInfoRead(callInfoRead:boolean){
        this.callInfoRead = callInfoRead;
    }

    public getRegistrationInformation():RegistrationInformation{
        return this.registrationInformation;
    }
}