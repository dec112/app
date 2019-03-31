import { Configuration } from "../configuration/configuration";
import { AppConfiguration } from "../configuration/appConfiguration";
import { UserConfiguration } from "../configuration/userConfiguration";
import { SipConfiguration } from "../configuration/sipConfiguration";
import { AdditionalInformation } from "../configuration/additionalInformation";
import { Target } from "../target";
import { EnumUtils } from "../../utils/enumUtils";
import { RegistrationInformation } from "../configuration/registrationInformation";

export class ConfigurationMapper {
    public static map(jsonString: string): Configuration {
        var configurationObject = JSON.parse(jsonString); 
        console.log(configurationObject);
        var configuration:Configuration = new Configuration(this.mapAppConfiguration(configurationObject.appConfiguration), this.mapUserConfiguration(configurationObject.userConfiguration), this.mapSipConfiguration(configurationObject.sipConfiguration), this.mapRegistrationInformation(configurationObject.registrationInformation));
        configuration.setIsConfiguredByUser(configurationObject.isConfigured);
        configuration.setLegalAccepted(configurationObject.legalAccepted);
        configuration.setCallInfoRead(configurationObject.callInfoRead);
        return configuration;
  }

    private static mapAppConfiguration(appConfigurationObject:any):AppConfiguration{
        var appConfiguration: AppConfiguration = new AppConfiguration();
        appConfiguration.setDefaultLanguage(appConfigurationObject.defaultLanguage);
        appConfiguration.setName(appConfigurationObject.name);
        appConfiguration.setSplashScreenFadeOutTimeInMs(appConfigurationObject.splashScreenFadeOutTimeInMs);
        appConfiguration.setVersion(appConfigurationObject.version);
        return appConfiguration;
    }

    private static mapUserConfiguration(userConfigurationObject:any):UserConfiguration{
        var userConfiguration:UserConfiguration = new UserConfiguration();
        userConfiguration.setCity(userConfigurationObject.city);
        userConfiguration.setCountry(userConfigurationObject.country);
        userConfiguration.setEmail(userConfigurationObject.email);
        userConfiguration.setFirstName(userConfigurationObject.firstName);
        userConfiguration.setLastName(userConfigurationObject.lastName);
        userConfiguration.setPassword(userConfigurationObject.password);
        userConfiguration.setPhoneNumber(userConfigurationObject.phoneNumber);
        userConfiguration.setPrivateIdentity(userConfigurationObject.privateIdentity);
        userConfiguration.setPublicIdentity(userConfigurationObject.publicIdentity);
        userConfiguration.setRealm(userConfigurationObject.realm);
        userConfiguration.setStreet(userConfigurationObject.street);
        userConfiguration.setTitle(userConfigurationObject.title);
        userConfiguration.setZipCode(userConfigurationObject.zipCode);
        for(var x = 0; x < userConfigurationObject.targets.length; x++){
            var target:Target = new Target(EnumUtils.getCallTargetEnumIdentifier(userConfigurationObject.targets[x].name), userConfigurationObject.targets[x].urn, userConfigurationObject.targets[x].publicIdentity, userConfigurationObject.targets[x].phone);
            userConfiguration.addTarget(target);
        }
        for(var i = 0; i < userConfigurationObject.additionalInformation.length; i++){
             var entry: AdditionalInformation = new AdditionalInformation(userConfigurationObject.additionalInformation[i].key, userConfigurationObject.additionalInformation[i].value);
            userConfiguration.addAdditionalInformation(entry);
        }
        return userConfiguration;
    }

    private static mapSipConfiguration(sipConfigurationObject:any):SipConfiguration{
        var sipConfiguration:SipConfiguration = new SipConfiguration();
        sipConfiguration.setAsteriskHack(sipConfigurationObject.asteriskHack)
        sipConfiguration.setHeartBeat(sipConfigurationObject.heartBeat);
        sipConfiguration.setSipProxyServer(sipConfigurationObject.sipProxyServer);
        sipConfiguration.setStunIceServer(sipConfigurationObject.stunIceServer);
        sipConfiguration.setWebSocketServer(sipConfigurationObject.webSocketServer);
        return sipConfiguration;
    }

    private static mapRegistrationInformation(registrationInformationObject:any):RegistrationInformation{
        var registrationInformation:RegistrationInformation = new RegistrationInformation();
        registrationInformation.setIsRegistered(registrationInformationObject.isRegistered);
        registrationInformation.setConfigurationOptained(registrationInformationObject.configurationOptained);
        registrationInformation.setDeviceId(registrationInformationObject.deviceId);
        registrationInformation.setPendingRegistration(registrationInformationObject.pendingRegistration);
        registrationInformation.setRegisteredEmail(registrationInformationObject.registeredEmail);
        registrationInformation.setRegisteredPhoneNumber(registrationInformationObject.registeredPhoneNumber);
        registrationInformation.setServices(registrationInformationObject.services);
        return registrationInformation;
    }
}