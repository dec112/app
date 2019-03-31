import * as _ from 'lodash';
import { Injectable } from '@angular/core';
import { Conversation } from '../models/conversation';
import { Message } from '../models/message';
import { v4 as uuid } from 'uuid';
import { Subject, Observable } from 'rxjs';

@Injectable()
export class ConversationManager {
  private conversations: Array<Conversation> = [];
  private conversationChangedSubject = new Subject<any>();

  constructor() {}

  public getConversationChangeEvent(): Observable<any> {
    return this.conversationChangedSubject.asObservable();
  }

  public updateMessageState(messageId) {
    var conversation = this.getActiveConversation();
    let currentMessage = conversation.getMessage(messageId);
    if(currentMessage){
        currentMessage.setSending(false);
        currentMessage.setSent(true);
        this.conversationChangedSubject.next(conversation);
    }
  }

  public store(message: Message) {
    var conversation = this.getActiveConversation();
    if (conversation) {
      conversation.addMessage(message);
      conversation.setIsActive(true);
    } else {
      conversation = new Conversation(uuid());
      conversation.addMessage(message);
      this.conversations.push(conversation);
    }
    this.conversationChangedSubject.next(conversation);
  }

  public setConversationInactive() {
    var conversation = this.getActiveConversation();
    if (conversation) {
      conversation.setIsActive(false);
    }
  }

  public getActiveConversation(): Conversation {
    var conversation = _.find(this.conversations, (c: Conversation) => {
      return c.getIsActive() === true;
    });
    if (conversation) {
      return conversation;
    } else {
      conversation = new Conversation(uuid());
      this.conversations.push(conversation);
    }
    return conversation;
  }
}
