export class AdditionalInformation {
    private key: string;
    private value: string;

    constructor(key: string, value: string) {
        this.key = key;
        this.value = value;
    }

    public getKey(){
        return this.key;
    }

    public getValue(){
        return this.value;
    }
}