export class RegistrationInformation {
    private isRegistered : boolean = false;
    private pendingRegistration : boolean = false;
    private registeredPhoneNumber : string = "";
    private registeredEmail : string = "";
    private services : Array < string > = [];
    private deviceId : string = "";
    private configurationOptained : boolean = false;


	public getIsRegistered(): boolean  {
		return this.isRegistered;
	}

	public getPendingRegistration(): boolean  {
		return this.pendingRegistration;
    }
    
	public getRegisteredPhoneNumber(): string  {
		return this.registeredPhoneNumber;
	}

	public getRegisteredEmail(): string  {
		return this.registeredEmail;
	}

	public getServices(): Array < string >  {
		return this.services;
	}

	public getDeviceId(): string  {
		return this.deviceId;
	}

	public getConfigurationOptained(): boolean  {
		return this.configurationOptained;
	}

	public setIsRegistered(value: boolean ) {
		this.isRegistered = value;
	}

	public setPendingRegistration(value: boolean ) {
		this.pendingRegistration = value;
	}

	public setRegisteredPhoneNumber(value: string ) {
		this.registeredPhoneNumber = value;
	}

	public setRegisteredEmail(value: string ) {
		this.registeredEmail = value;
	}

	public setServices(value: Array < string > ) {
		this.services = value;
	}

	public setDeviceId(value: string ) {
		this.deviceId = value;
	}

	public setConfigurationOptained(value: boolean ) {
		this.configurationOptained = value;
	}

}