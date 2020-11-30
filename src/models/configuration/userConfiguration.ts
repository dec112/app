import { AdditionalInformation } from "./additionalInformation";
import { Target } from "../target";
import * as _ from 'lodash';
import { CallTarget } from "../../constants/callTarget";

export class UserConfiguration {

    private title: string = "";
    private firstName: string = "";
    private lastName: string = "";
    private phoneNumber: string = "";
    private email: string = "";
    private street: string = "";
    private city: string = "";
    private zipCode: number;
    private country: string = "";
    private publicIdentity: string = "sip:43a550def631ef8e418fb8a9e8540435@root.dects.dec112.eu";
    private privateIdentity: string = "43a550def631ef8e418fb8a9e8540435";
    private password: string = "a8f4d51a7ed1d8fb36b17cd3";
    private realm: string = "root.dects.dec112.eu";
    private targets: Array<Target> = [
        new Target(CallTarget.POLICE, "urn:service:sos.police", "sip:133@root.dects.dec112.eu", 133),
        new Target(CallTarget.FIRE_BRIGADE, "urn:service:sos.fire", "sip:122@root.dects.dec112.eu", 122),
        new Target(CallTarget.AMBULANCE, "urn:service:sos.ambulance", "sip:144@root.dects.dec112.eu", 144),
        new Target(CallTarget.EURO_CALL, "urn:service:sos.police", "sip:112@root.dects.dec112.eu", 112),
        new Target(CallTarget.MOUNTAIN_CALL, "urn:service:sos.mountain", "sip:140@root.dects.dec112.eu", 140),
        new Target(CallTarget.BOT_CALL, "urn:service:sos.bot", "sip:fillinBotCall@fillinService.fillinDomain.at", 555),
        new Target(CallTarget.POLICE_TEST, "urn:service:sos.police", "sip:9133@root.dects.dec112.eu", 9133),
        new Target(CallTarget.FIRE_BRIGADE_TEST, "urn:service:sos.fire", "sip:9122@root.dects.dec112.eu", 9122),
        new Target(CallTarget.AMBULANCE_TEST, "urn:service:sos.ambulance", "sip:9144@root.dects.dec112.eu", 9144),
        new Target(CallTarget.EURO_CALL_TEST, "urn:service:sos.police", "sip:9112@root.dects.dec112.eu", 9112),
        new Target(CallTarget.MOUNTAIN_CALL_TEST, "urn:service:sos.mountain", "sip:9140@root.dects.dec112.eu", 9140)
    ];
    private additionalInformation: Array<AdditionalInformation> = [];

    constructor() {
    }

    public getDisplayName(): string {
        return this.firstName + " " + this.lastName;
    }

    public getTitle(): string {
        return this.title;
    }

    public setTitle(title: string) {
        this.title = title;
    }

    public getFirstName(): string {
        return this.firstName;
    }

    public setFirstName(firstName: string) {
        this.firstName = firstName;
    }

    public getLastName(): string {
        return this.lastName;
    }

    public setLastName(lastName: string) {
        this.lastName = lastName;
    }

    public getPhoneNumber(): string {
        return this.phoneNumber;
    }

    public setPhoneNumber(phoneNumber: string) {
        this.phoneNumber = phoneNumber;
    }

    public getEmail(): string {
        return this.email;
    }

    public setEmail(email: string) {
        this.email = email;
    }

    public getStreet(): string {
        return this.street;
    }

    public setStreet(street: string) {
        this.street = street;
    }

    public getCity(): string {
        return this.city;
    }

    public setCity(city: string) {
        this.city = city;
    }

    public getZipCode(): number {
        return this.zipCode;
    }

    public setZipCode(zipCode: number) {
        this.zipCode = zipCode;
    }

    public getCountry(): string {
        return this.country;
    }

    public setCountry(country: string) {
        this.country = country;
    }

    public getPublicIdentity(): string {
        return this.publicIdentity;
    }

    public setPublicIdentity(publicIdentity: string) {
        this.publicIdentity = publicIdentity;
    }

    public getPrivateIdentity(): string {
        return this.privateIdentity;
    }

    public setPrivateIdentity(privateIdentity: string) {
        this.privateIdentity = privateIdentity;
    }

    public getPassword(): string {
        return this.password;
    }

    public setPassword(password: string) {
        this.password = password;
    }

    public getRealm(): string {
        return this.realm;
    }

    public setRealm(realm: string) {
        this.realm = realm;
    }

    public getAdditionalInformation(): Array<AdditionalInformation> {
        return this.additionalInformation;
    }

    public setAdditionalInformation(additionalInformation: Array<AdditionalInformation>) {
        this.additionalInformation = additionalInformation;
    }

    public addAdditionalInformation(additionalInformation: AdditionalInformation) {
        this.additionalInformation.push(additionalInformation);
    }

    public deleteAdditionalInformation(key: string) {
        _.remove(this.additionalInformation, function (n: AdditionalInformation) {
            return n.getKey() === key;
        });
    }

    public getFullName(): string {
        return this.title + " " + this.lastName + " " + this.firstName;
    }

    public setTargets(targets: Array<Target>) {
        this.targets = targets;
    }

    public addTarget(target: Target) {
        this.targets.push(target);
    }

    public getTargets(): Array<Target> {
        return this.targets;
    }

    public getTarget(target: CallTarget): Target {
        var targetToReturn: Target = null;
        for (var i = 0; i < this.targets.length; i++) {
            if (this.targets[i].getName() === target) {
                targetToReturn = this.targets[i];
            }
        }
        return targetToReturn;
    }

    public getTargetByStringIdentifier(target: string): Target {
        var targetToReturn: Target = null;
        for (var i = 0; i < this.targets.length; i++) {
            if (this.targets[i].getName().toString() === target) {
                targetToReturn = this.targets[i];
            }
        }
        return targetToReturn;
    }
}
