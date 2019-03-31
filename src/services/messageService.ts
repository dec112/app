import * as _ from 'lodash';
import { Injectable } from '@angular/core';
import { MultipartMime } from '../models/multiPartMime';
import { SipConfiguration } from '../models/configuration/sipConfiguration';
import { ConfigurationService } from './configurationService';
import { MimeHeader } from '../models/mimeHeader';
import { MimePart } from '../models/mimePart';
import { MessageUtils } from '../utils/messageUtils';
import { StringUtils } from '../utils/stringUtils';
import { PositionService } from './positionService';
import { UserConfiguration } from '../models/configuration/userConfiguration';
import { SipService } from './sipService';
import { GeoPosition } from '../models/geoPosition';
import { Message } from '../models/message';
import { ConversationManager } from '../manager/conversationManager';
import { SipMessageSentEventArgs } from '../models/eventArgs/sipMessageSentEventArgs';
import { SipStatus } from '../constants/sipStatus';
import { MessageDirection } from '../constants/messageDirection';
import { StorageService } from './storageService';
import * as sha1 from 'js-sha1';
import { MessageType } from '../constants/messageType';
import { TranslateService } from '@ngx-translate/core';
import { Device } from '@ionic-native/device';
import { Subject, Observable } from 'rxjs';
import { v4 as uuid } from 'uuid';

@Injectable()
export class MessageService {
  private messageReceivedErrorSubject = new Subject<any>();
  private endCallSubject = new Subject<any>();

  constructor(
    protected translate: TranslateService,
    protected configurationService: ConfigurationService,
    protected positionService: PositionService,
    protected sipService: SipService,
    protected conversationManager: ConversationManager,
    protected storageService: StorageService,
    protected device: Device
  ) {
    this.initListener();
  }

  public getMessageReceivedErrorEvent(): Observable<any> {
    return this.messageReceivedErrorSubject.asObservable();
  }

  public getEndCallEvent(): Observable<any> {
    return this.endCallSubject.asObservable();
  }

  public sendTextMessage(text: string, includeLocation: boolean, includeVcard: boolean) {
    //SMS.send(this.text.number, this.text.message).then((result) => {
    //}, (error) => {
    //});
  }

  public sendMessage(receiverDisplayName: string, text: string, includeLocation: boolean, currentMessageType: MessageType) {
    const includeVcard = currentMessageType === MessageType.START_CALL;
    const messageId = uuid();
    var sipConfiguration: SipConfiguration = this.configurationService.getConfiguration().getSipConfiguration();
    var userConfiguration: UserConfiguration = this.configurationService.getConfiguration().getUserConfiguration();
    // create multipart mime message
    var body = '';
    var parts = new MultipartMime(null, null);

    // set message SIP options
    var sipMessageOptions: any = {};
    if (sipConfiguration.getAsteriskHack()) {
      sipMessageOptions.contentType = 'text/plain;charset=UTF-8';
      sipMessageOptions.extraHeaders = ['X-dec112-contentType: multipart/mixed; boundary=' + parts.getBoundary()];
    } else {
      (sipMessageOptions.contentType = 'multipart/mixed; boundary=' + parts.getBoundary()), (sipMessageOptions.extraHeaders = []);
    }

    // add message text to multipart mime
    // if available
    if (text) {
      parts.addPart(new MimePart('message', [new MimeHeader('Content-Type', 'text/plain;charset=UTF-8')], text));
    }

    // if position is available add pidf to multipart mime
    // includeLocation values:
    //		0,false,null,undef		add location if valid
    //		1,true					always include location even if invalid
    //		2						never include location
    if (!includeLocation || includeLocation === true || includeLocation === 1) {
      if (includeLocation || (!includeLocation && this.positionService.isPositionValid())) {
        var currentPosition = this.positionService.getPosition();
        var lat = currentPosition.getLatitude();
        var lon = currentPosition.getLongitude();
        var contentID = StringUtils.strRandom(16) + '@dec112.app';
        if (lat && lon) {
          parts.addPart(
            new MimePart(
              'position',
              [new MimeHeader('Content-Type', 'application/pidf+xml'), new MimeHeader('Content-ID', '<' + contentID + '>')],
              MessageUtils.createPidf(contentID, currentPosition.getLatitude(), currentPosition.getLongitude(), this.device.uuid, null)
            )
          );

          sipMessageOptions.extraHeaders.push('Geolocation-Routing: yes');
          sipMessageOptions.extraHeaders.push('Geolocation: <cid:' + contentID + '>');
        }
      }
    }

    // add additional customer data
    // see https://tools.ietf.org/html/draft-ietf-ecrit-additional-data-02#section-11.3
    if (includeVcard) {
      parts.addPart(new MimePart('additional-data', [new MimeHeader('Content-Type', 'application/addCallSub+xml')], MessageUtils.createVcard(userConfiguration)));
    }

    var type = currentMessageType ? currentMessageType : MessageType.UNKNOWN;
    var includeText = text && text.length > 0;
    var deviceUUID = sha1(
      this.configurationService
        .getConfiguration()
        .getUserConfiguration()
        .getPhoneNumber() +
        this.configurationService
          .getConfiguration()
          .getUserConfiguration()
          .getEmail()
    );
    var messageInformation = MessageUtils.generateMessageCallInfoHeader(type, includeLocation && this.positionService.isPositionValid(), includeVcard, includeText);
    var messageInformationDecimal = parseInt(messageInformation, 2);

    // send message
    body = parts.toString();
    sipMessageOptions.extraHeaders.push('Call-Info: <urn:dec112:uid:callid:' + this.conversationManager.getActiveConversation().getKey() + ':service.dec112.at>;purpose=dec112-CallId');
    sipMessageOptions.extraHeaders.push('Call-Info: <urn:dec112:uid:deviceid:' + deviceUUID + ':service.dec112.at>;purpose=dec112-DeviceId');
    sipMessageOptions.extraHeaders.push('Call-Info: <urn:dec112:uid:msgtype:' + messageInformationDecimal + ':service.dec112.at>; purpose=dec112-MsgType');
    var language = window.navigator.language || this.translate.currentLang;
    var languageShortcut = 'en';
    if (language) {
      languageShortcut = language.substring(0, 2);
    }
    sipMessageOptions.extraHeaders.push('Call-Info:  <urn:dec112:uid:language:' + languageShortcut + ':service.dec112.at>;purpose=dec112-Language');
    this.sipService.message(body, sipMessageOptions, messageId);

    // create local message representation for GUI display
    // and storrage
    if (text) {
      var position: GeoPosition = this.positionService.getPosition();
      var messageObj = new Message(
        null,
        userConfiguration.getPublicIdentity(),
        userConfiguration.getDisplayName(),
        this.sipService.getCurrentCallTarget(),
        receiverDisplayName,
        MessageDirection.OUT,
        text,
        this.positionService.isPositionValid()
          ? {
              accuracy: position.getAccuracy(),
              latitude: position.getLatitude(),
              longitude: position.getLongitude(),
              indicatorEW: position.getIndicatorEW(),
              indicatorNS: position.getIndicatorNS(),
            }
          : null,
        body,
        messageId
      );
      this.conversationManager.store(messageObj);
    }
  }

  public endConversation() {
    this.sipService.unRegister();
    this.conversationManager.setConversationInactive();
  }

  private initListener() {
    this.sipService.getSipMessageReceivedEvent().subscribe(evt => {
      this.sipMessageReceived(evt);
    });
    this.sipService.getSipMessageSentEvent().subscribe(evt => {
      if (evt.status === SipStatus.OK) {
        this.conversationManager.updateMessageState(evt.messageId);
      }
      this.sipMessageSent(evt);
    });
  }

  private sipMessageReceived(evt) {
    this.checkMessageHeaders(evt);
    var userConfiguration: UserConfiguration = this.configurationService.getConfiguration().getUserConfiguration();
    var text = _.get(evt, 'message.request.body', '').toString();
    var senderUri = _.get(evt, 'message.request.from.uri', '').toString();
    var senderDisplayName = _.get(evt, 'message.request.from.display_name', '').toString();

    var messageObj = new Message(null, senderUri, senderDisplayName, userConfiguration.getPublicIdentity(), userConfiguration.getDisplayName(), MessageDirection.IN, text, null, null, uuid());
    messageObj.setSent(true);
    messageObj.setSending(false);
    this.conversationManager.store(messageObj);
  }

  private sipMessageSent(evt: SipMessageSentEventArgs) {
    if (evt.status !== SipStatus.OK) {
      this.messageReceivedErrorSubject.next();
    } else {
      evt.message;
    }
  }

  private checkMessageHeaders(sipEvt) {
    if (sipEvt.message.request.headers['Call-Info']) {
      for (var i = 0; i < sipEvt.message.request.headers['Call-Info'].length; i++) {
        var header = sipEvt.message.request.headers['Call-Info'][0];
        if (header && header.raw.indexOf('msgtype') > -1) {
          var parts = header.raw.split(':');
          if (parts.length >= 4) {
            var messageTypeString = parts[4];
            var parsedMessageType = MessageUtils.parseMessageCallInfoHeader(parseInt(messageTypeString));
            if (parsedMessageType === MessageType.END_CALL) {
              this.endCallSubject.next(sipEvt);
            }
          }
        }
      }
    }
  }
}
