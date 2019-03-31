import * as _ from 'lodash';
import { Injectable, Sanitizer, SecurityContext, NgZone } from '@angular/core';
import { ConfigurationService } from './configurationService';
import { SipMessageSentEventArgs } from '../models/eventArgs/sipMessageSentEventArgs';
import { SipStatus } from '../constants/sipStatus';
import { LocalizationProperty } from '../constants/localizationProperty';
import { SipErrorMessage } from '../constants/sipErrorMessage';
import { TranslateService } from '@ngx-translate/core';
import { Subject, Observable } from 'rxjs';
import * as JsSIP from 'jssip';

@Injectable()
export class SipService {
  private oSipStack;
  private currentCallTarget: string = '';
  private sipInitialized: boolean = false;
  private sipMessageSentSubject = new Subject<SipMessageSentEventArgs>();
  private sipRegistrationFailueSubject = new Subject<SipMessageSentEventArgs>();
  private sipRegisteredSubject = new Subject<any>();
  private sipUnregisteredSubject = new Subject<any>();
  private sipWebsocketConnectSubject = new Subject<any>();
  private sipWebsocketDisconnectSubject = new Subject<any>();
  private sipRtcSessionSubject = new Subject<any>();
  private sipMessageReceivedSubject = new Subject<any>();
  private sipNotifyReceivedSubject = new Subject<any>();

  constructor(protected translateService: TranslateService, protected configurationService: ConfigurationService, protected sanitizer: Sanitizer, protected ngZone: NgZone) {}

  public getSipMessageSentEvent(): Observable<SipMessageSentEventArgs> {
    return this.sipMessageSentSubject.asObservable();
  }

  public getSipRegisteredEvent(): Observable<any> {
    return this.sipRegisteredSubject.asObservable();
  }

  public getSipUnregisteredEvent(): Observable<any> {
    return this.sipUnregisteredSubject.asObservable();
  }

  public getSipWebsocketConnectEvent(): Observable<any> {
    return this.sipWebsocketConnectSubject.asObservable();
  }

  public getSipWebsocketDisconnectEvent(): Observable<any> {
    return this.sipWebsocketDisconnectSubject.asObservable();
  }

  public getSipRtcSessionEvent(): Observable<any> {
    return this.sipRtcSessionSubject.asObservable();
  }

  public getSipMessageReceivedEvent(): Observable<any> {
    return this.sipMessageReceivedSubject.asObservable();
  }

  public getSipNotifyReceivedEvent(): Observable<any> {
    return this.sipNotifyReceivedSubject.asObservable();
  }

  public getSipRegistrationFailureEvent(): Observable<any> {
    return this.sipRegistrationFailueSubject.asObservable();
  }

  public setCurrentCallTarget(callTarget: string) {
    this.currentCallTarget = callTarget;
  }

  public getCurrentCallTarget(): string {
    return this.currentCallTarget;
  }

  public getWsErrorMessage(code, localize) {
    var errorMessage = '';

    if (localize) errorMessage = this.translateService.instant('WS_STATUS_CODE_' + code);

    // original error messages as defined in RFC6455
    // https://tools.ietf.org/html/rfc6455
    if (!errorMessage || errorMessage === 'WS_STATUS_CODE_' + code) {
      switch (code) {
        case 1000:
          errorMessage = SipErrorMessage.NORMAL_CLOSURE.toString();
          break;
        case 1001:
          errorMessage = SipErrorMessage.GOING_AWAY.toString();
          break;
        case 1002:
          errorMessage = SipErrorMessage.PROTOCOL_ERROR.toString();
          break;
        case 1003:
          errorMessage = SipErrorMessage.UNSUPPORTED_DATA.toString();
          break;
        case 1004:
          errorMessage = SipErrorMessage.RESERVED.toString();
          break;
        case 1005:
          errorMessage = SipErrorMessage.NO_STATUS_RECEIVED.toString();
          break;
        case 1006:
          errorMessage = SipErrorMessage.ABNORMAL_CLOSURE.toString();
          break;
        case 1007:
          errorMessage = SipErrorMessage.INVALID_FRAME_PAYLOAD_DATA.toString();
          break;
        case 1008:
          errorMessage = SipErrorMessage.POLICY_VIOLATION.toString();
          break;
        case 1009:
          errorMessage = SipErrorMessage.MESSAGE_TOO_BIG.toString();
          break;
        case 1010:
          errorMessage = SipErrorMessage.MANDATORY_EXT.toString();
          break;
        case 1011:
          errorMessage = SipErrorMessage.INTERNAL_SERVER_ERROR.toString();
          break;
        case 1015:
          errorMessage = SipErrorMessage.TLS_HANDSHAKRE.toString();
          break;
        default:
          errorMessage = SipErrorMessage.UNKNOWN_WEBSOCKET_ERROR.toString();
          break;
      }
    }

    return errorMessage;
  }

  public getSipErrorMessage(sipEvt, localize) {
    // NOT IMPLEMENTED
    var errorMessage = '';
  }

  public getErrorMessage(sipEvt, localize) {
    var self = this;
    var errorMessage = '';

    if (sipEvt) {
      if (sipEvt.code) {
        // websocket error
        errorMessage =
          this.translateService.instant(LocalizationProperty.WS_ERROR.toString()) + '<br>' + '<b>' + this.sanitizer.sanitize(SecurityContext.NONE, sipEvt.code) + '</b>: ' + self.getWsErrorMessage(sipEvt.code, localize);
      } else if (sipEvt.response && sipEvt.cause) {
        // sip error
        errorMessage =
          this.translateService.instant(LocalizationProperty.SIP_ERROR.toString()) +
          '<br>' +
          '<b>' +
          this.sanitizer.sanitize(SecurityContext.NONE, sipEvt.cause) +
          ' ' +
          this.sanitizer.sanitize(SecurityContext.NONE, sipEvt.response.status_code) +
          '</b>: ' +
          //self.getSipErrorMessage(sipEvt.response.status_code, localize) +
          this.sanitizer.sanitize(SecurityContext.NONE, sipEvt.response.reason_phrase);
      } else if (sipEvt.cause) {
        // sip error
        errorMessage = this.translateService.instant(LocalizationProperty.SIP_ERROR.toString()) + '<br>' + '<b>' + this.sanitizer.sanitize(SecurityContext.NONE, sipEvt.cause);
      }
    }

    return errorMessage;
  }

  public register() {
    this.ngZone.run(() => {
      if (!this.sipInitialized) {
        this.initSipStack();
      }
      this.oSipStack.start();
    });
  }

  public unRegister() {
    console.log('SIP service unRegister');

    if (this.oSipStack) {
      var options = {
        all: true,
      };
      this.oSipStack.unregister(options);
      this.oSipStack.stop();
    }
  }

  public call(receiver) {
    console.log('SIP call (' + receiver + ')');
  }

  public message(message, options, messageId) {
      console.log('SIP send message to (' + this.currentCallTarget + ')');

      var smsEventHandlers = {
        succeeded: evt => {
          console.log('SIP send message OK');
          this.sipMessageSentSubject.next(new SipMessageSentEventArgs(SipStatus.OK, evt, this.currentCallTarget, message, messageId));
        },

        failed: evt => {
          console.error('SIP send message ERROR (' + evt.cause + ')');
          this.sipMessageSentSubject.next(new SipMessageSentEventArgs(SipStatus.FAIL, evt, this.currentCallTarget, message, messageId));
        },
      };

      var smsOptions = options || {};
      smsOptions.eventHandlers = smsEventHandlers;
      console.log('SIP trying to send message to (' + this.currentCallTarget + ')');
      this.oSipStack.sendMessage(this.currentCallTarget, message, smsOptions);
  }

  private initSipStack() {
    var configuration = {
      ws_servers: this.configurationService
        .getConfiguration()
        .getSipConfiguration()
        .getWebSocketServer(),
      display_name: this.configurationService
        .getConfiguration()
        .getUserConfiguration()
        .getDisplayName(),
      uri: this.configurationService
        .getConfiguration()
        .getUserConfiguration()
        .getPublicIdentity(),
      registrar_server: this.configurationService
        .getConfiguration()
        .getSipConfiguration()
        .getSipProxyServer(),
      authorization_user: this.configurationService
        .getConfiguration()
        .getUserConfiguration()
        .getPrivateIdentity(),
      password: this.configurationService
        .getConfiguration()
        .getUserConfiguration()
        .getPassword(),
      realm: this.configurationService
        .getConfiguration()
        .getUserConfiguration()
        .getRealm(),
      //'stun_servers': [],
      //'turn_servers': [],
      register: true,
      register_expires: 600,
      no_answer_timeout: 60,
      use_preloaded_route: true,
      hack_via_tcp: true,
      hack_via_ws: true,
      hack_ip_in_contact: true,
    };

    this.oSipStack = new JsSIP.UA(configuration);

    // Registration/Deregistration callbacks
    this.oSipStack.on('registered', evt => {
      console.log('SIP registered');
      this.ngZone.run(() => {
        this.sipRegisteredSubject.next(evt);
      });
    });

    this.oSipStack.on('unregistered', evt => {
      console.log('SIP unregistered');
      this.sipUnregisteredSubject.next(evt);
    });

    this.oSipStack.on('registrationFailed', evt => {
      console.error('SIP registration failure');
      this.sipRegistrationFailueSubject.next(evt);
    });

    // Transport connection/disconnection callbacks
    this.oSipStack.on('connected', evt => {
      console.log('SIP websocket connected');
      this.sipWebsocketConnectSubject.next(evt);
    });

    this.oSipStack.on('disconnected', evt => {
      // see http://tools.ietf.org/html/rfc6455
      if (evt.code != 1000 && evt.code != 1001) console.error('SIP websocket disconnected due to error (' + evt.code + ')');
      else console.log('SIP websocket disconnected');
      this.sipWebsocketDisconnectSubject.next(evt);
    });

    // Call / Message reception callbacks
    this.oSipStack.on('newRTCSession', evt => {
      var callerUri = evt.request.from.uri.toString();

      console.log('SIP new RTC session (call) from (' + callerUri + ')');
      console.error('SIP voice calls are not supported');

      this.sipRtcSessionSubject.next(evt);
      evt.session.terminate();
    });

    this.oSipStack.on('newMessage', evt => {
      this.ngZone.run(() => {
        console.log(evt);
        if (!evt) return;

        if (evt.originator === 'remote') {
          var message = _.get(evt, 'message.request.body', '').toString();
          var senderDisplayName = _.get(evt, 'message.request.from.display_name', '').toString();
          var senderUri = _.get(evt, 'message.request.from.uri', '').toString();
          console.log('SIP new message from (' + senderDisplayName + ' / ' + senderUri + ')', message);

          this.sipMessageReceivedSubject.next(evt);
        }
      });
    });

    this.oSipStack.on('notify', evt => {
      console.log('SIP notify received');
      this.sipNotifyReceivedSubject.next(evt);
    });

    this.oSipStack.on('unknownMessage', evt => {
      console.log('SIP unknown message received');
    });
    this.sipInitialized = true;
  }
}
