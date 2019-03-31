export class AppConfiguration {

    private name: string = 'dec112-mobile';
    private version: string = '1.1.0';
    private defaultLanguage: string = 'en';
    private splashScreenFadeOutTimeInMs: number = 3000;

    constructor() {
    }

    public getName(){
        return this.name;
    }

    public setName(name:string){
        this.name = name;
    }

    public getVersion(){
        return this.version;
    }

    public setVersion(version:string){
        this.version = version;
    }

    public getDefaultLanguage(){
        return this.defaultLanguage;
    }

    public setDefaultLanguage(defaultLanguage:string){
        this.defaultLanguage = defaultLanguage;
    }

    public getSplashScreenFadeOutTimeInMs(){
        return this.splashScreenFadeOutTimeInMs;
    }

    public setSplashScreenFadeOutTimeInMs(fadeOutTimeInMs:number){
        this.splashScreenFadeOutTimeInMs = fadeOutTimeInMs;
    }
}