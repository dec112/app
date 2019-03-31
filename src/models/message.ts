import { DateUtils } from '../utils/dateUtils';
import { MessageDirection } from '../constants/messageDirection';

export class Message {
  private id:string;
  private timeStamp: any = Date.now();
  private senderUri: string = '';
  private senderDisplayName: string = '';
  private receiverUri: string = '';
  private receiverDisplayName: string = '';
  private direction: MessageDirection;
  private text: string = '';
  private location = null;
  private body = null;
  private isVisible: boolean = true;
  private sending:boolean = true;
  private sent:boolean = false;

  constructor(timeStamp, senderUri, senderDisplayName, receiverUri, receiverDisplayName, direction, text, location, body, uuid) {
    this.id = uuid;
    this.timeStamp = !timeStamp ? Date.now() : timeStamp;
    this.senderUri = senderUri;
    this.senderDisplayName = senderDisplayName;
    this.receiverUri = receiverUri;
    this.receiverDisplayName = receiverDisplayName;
    this.direction = direction;
    this.text = text;
    this.location = location;
    this.body = body;
  }

  public getText() {
    return this.text;
  }

  public getTime() {
    return DateUtils.formatDateTime(this.timeStamp);
  }

  public getDirection(): MessageDirection {
    return this.direction;
  }

  public getSenderUri(): string {
    return this.senderUri;
  }

  public getReceiverUri(): string {
    return this.receiverUri;
  }

  public getSenderDisplayName(): string {
    return this.senderDisplayName;
  }

  public getReceiverDisplayName(): string {
    return this.receiverDisplayName;
  }

  public getLocation() {
    return this.location;
  }

  public getBody() {
    return this.body;
  }

  public getPosition() {
    return this.getDirection() == MessageDirection.IN ? 'right' : 'left';
  }

  public getIsVisible() {
    return this.isVisible;
  }

  public setIsVisible(visible: boolean) {
    this.isVisible = visible;
  }

  public isSending(){
    return this.sending;
  }

  public setSending(sending:boolean){
    this.sending = sending;
  }

  public isSent(){
    return this.sent;
  }

  public setSent(sent:boolean){
    this.sent = sent;
  }

  public getId(){
    return this.id;
  }

  public getSent(){
    return this.sent;
  }

  public getSending(){
    return this.sending;
  }
}
