export class SipConfiguration {

    private asteriskHack: boolean = false;
    private heartBeat:number = 20;
    private webSocketServer: string = 'ws://root.dects.dec112.eu:8088';
    private sipProxyServer: string = '';
    private stunIceServer: string = 'stun:stun.l.google.com:19302';

    constructor() {
    }

    public getAsteriskHack(){
        return this.asteriskHack;
    }

    public setAsteriskHack(asteristHack:boolean){
        this.asteriskHack = asteristHack;
    }

    public getHeartBeat(){
        return this.heartBeat;
    }

    public setHeartBeat(heartBeat:number){
        this.heartBeat = heartBeat;
    }

    public getWebSocketServer(){
        return this.webSocketServer;
    }

    public setWebSocketServer(webSocketServer:string){
        this.webSocketServer = webSocketServer;
    }

    public getSipProxyServer(){
        return this.sipProxyServer;
    }

    public setSipProxyServer(sipProxyServer:string){
        this.sipProxyServer = sipProxyServer;
    }

    public getStunIceServer(){
        return this.stunIceServer;
    }

    public setStunIceServer(stunIceServer:string){
        this.stunIceServer = stunIceServer;
    }
}
