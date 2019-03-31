import { SipStatus } from "../../constants/sipStatus";

export class SipMessageSentEventArgs {
    private _status:SipStatus;
    private _event:any;
    private _receiver;
    private _message;
    private _messageId;

    constructor(status:SipStatus, event:any, receiver, message, messageId){
        this._status = status;
        this._event = event;
        this._receiver = receiver;
        this._message = message;
        this._messageId = messageId;
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

    get messageId(){
        return this._messageId;
    }
}