export class GeoPosition{
    
    private indicatorEW:string = "";
    private indicatorNS:string = "";
    private longitude:number = 0;
    private latitude:number = 0;
    private accuracy:number = 0;

    public getIndicatorEW():string{
        return this.indicatorEW;
    }

    public setIndicatorEW(indicator:string){
        this.indicatorEW = indicator;
    }

    public getIndicatorNS():string{
        return this.indicatorNS;
    }

    public setIndicatorNS(indicator:string){
        this.indicatorNS = indicator;
    }

    public getLongitude():number{
        return this.longitude;
    }

    public setLongitude(longitude:number){
        this.longitude = longitude;
    }

    public getLatitude():number{
        return this.latitude;
    }

    public setLatitude(latitude:number){
        this.latitude = latitude;
    }

    public getAccuracy():number{
        return this.accuracy;
    }

    public setAccuracy(accuracy:number){
        this.accuracy = accuracy;
    }
}