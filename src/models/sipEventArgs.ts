import { SipStatus } from "../constants/sipStatus";

export class SipEventArgs {
    private _status:SipStatus;
    private _event:any;
    private _receiver;
    private _message;

    constructor(status:SipStatus, event:any, receiver, message){
        this._status = status;
        this._event = event;
        this._receiver = receiver;
        this._message = message;
    }

    get status():SipStatus{
        return this._status;
    }

    get event(){
        return this._event;
    }

    get receiver(){
        return this._receiver;
    }

    get message(){
        return this._message;
    }
}