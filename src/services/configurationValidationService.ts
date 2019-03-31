import { Injectable } from "@angular/core";
import { UserConfiguration } from '../models/configuration/userConfiguration';

@Injectable()
export class ConfigurationValidationService {

    constructor() {

    }

    public isZipCodeValid(zip: string) {
        return /^\d{4}$/.test(zip);
    }

    public isEmailValid(email: string) {
        return /^[a-z][a-zA-Z0-9_.]*(\.[a-zA-Z][a-zA-Z0-9_.]*)?@[a-z][a-zA-Z-0-9]*\.[a-z]+(\.[a-z]+)?$/.test(email);
    }

    public isValidUrl(url: string) {
        return /^((http[s]?|ftp):\/)?\/?([^:\/\s]+)((\/\w+)*\/)([\w\-\.]+[^#?\s]+)(.*)?(#[\w\-]+)?$/.test(url);
    }

    public isValidPhone(phone:string){
        return /^(\(?\+?[0-9]*\)?)?[0-9_\- \(\)]*$/.test(phone);
    }

    public isValidName(name:string){
        return /^[a-zA-Z]{3,30}$/.test(name);
    }

    public isSipConfigurationValid(userConfiguration: UserConfiguration){

    }
}