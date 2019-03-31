import { Component, Input } from '@angular/core';
import { Message } from "../models/message";
import { MessageDirection } from '../constants/messageDirection';

@Component({
    selector: 'chat-bubble',
    templateUrl: 'chatBubble.html'
})
export class ChatBubble {

    @Input() message: Message;

    constructor() {
    }

    getMessageDirection(){
        return MessageDirection;
    }
}