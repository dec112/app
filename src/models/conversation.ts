import { Message } from "./message";

export class Conversation {
    private key:string;
    private isActive:boolean = true;
    private messages:Array<Message>=[];
    
    constructor(key:string){
        this.key = key;
    }

    public getKey(){
        return this.key;
    }   

    public getIsActive(){
        return this.isActive;
    }

    public setIsActive(active:boolean){
        this.isActive = active;
    }

    public getMessages(){
        return this.messages;
    }

    public addMessage(message:Message){
        this.messages.push(message);
    }

    public getMessage(messageId){
        return this.messages.find(message => message.getId() === messageId);
    }
}