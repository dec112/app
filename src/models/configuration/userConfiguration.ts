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
    private publicIdentity: string = "";
    private privateIdentity: string = "";
    private password: string = "";
    private realm: string = "";
    private targets: Array<Target> = [
        new Target(CallTarget.POLICE, "urn:service:sos.police", "sip:fillinPolice@fillinService.fillinDomain.at", 133),
        new Target(CallTarget.FIRE_BRIGADE, "urn:service:sos.fire", "sip:fillinFireBrigate@fillinService.fillinDomain.at", 122),
        new Target(CallTarget.AMBULANCE, "urn:service:sos.ambulance", "sip:fillinAmbulance@fillinService.fillinDomain.at", 144),
        new Target(CallTarget.EURO_CALL, "urn:service:sos.police", "sip:fillinEuroCall@fillinService.fillinDomain.at", 112),
        new Target(CallTarget.MOUNTAIN_CALL, "urn:service:sos.mountain", "sip:fillinMountainCall@fillinService.fillinDomain.at", 140),
        new Target(CallTarget.BOT_CALL, "urn:service:sos.bot", "sip:fillinBotCall@fillinService.fillinDomain.at", 555)
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

    public setTargets(targets:Array<Target>){
        this.targets = targets;
    }

    public addTarget(target:Target){
        this.targets.push(target);
    }

    public getTargets():Array<Target>{
        return this.targets;
    }

    public getTarget(target:CallTarget):Target{
        var targetToReturn:Target = null;
        for(var i = 0; i < this.targets.length; i++){
            if(this.targets[i].getName() === target){
                targetToReturn = this.targets[i];
            }
        }
        return targetToReturn;
    }

       public getTargetByStringIdentifier(target:string):Target{
        var targetToReturn:Target = null;
        for(var i = 0; i < this.targets.length; i++){
            if(this.targets[i].getName().toString() === target){
                targetToReturn = this.targets[i];
            }
        }
        return targetToReturn;
    }
}