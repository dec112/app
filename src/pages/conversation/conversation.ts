import { ConnectingPage } from './../modal/connecting/connecting';
import { SubScriptionManager } from './../../manager/subscriptionManager';
import * as _ from 'lodash';
import * as moment from 'moment';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { MainPage } from '../main/main';
import { NavController, NavParams, AlertController, Content, ModalController, Modal } from 'ionic-angular';
import { PositionService } from '../../services/positionService';
import { NetworkService } from '../../services/networkService';
import { MessageService } from '../../services/messageService';
import { ConfigurationService } from '../../services/configurationService';
import { MessageUtils } from '../../utils/messageUtils';
import { ConversationManager } from '../../manager/conversationManager';
import { Conversation } from '../../models/conversation';
import { NavigationParameter } from '../../constants/navigationParameter';
import { LocalizationProperty } from '../../constants/localizationProperty';
import { TimerManagerElapsedEventArgs } from '../../models/eventArgs/timerManagerElapsedEventArgs';
import { TimerIdentifier } from '../../constants/timerIdentifier';
import { TimerManager } from '../../manager/timerManager';
import { TimeConstant } from '../../constants/timeConstant';
import { SuggestionsPage } from '../modal/suggestions/suggestions';
import { DismissSuggestionsEventArgs } from '../../models/eventArgs/dismissSuggestionsEventArgs';
import { MessageType } from '../../constants/messageType';
import { SipService } from '../../services/sipService';
import { TranslateService } from '@ngx-translate/core';
import { Insomnia } from '@ionic-native/insomnia';
import { Subscription } from 'rxjs';
import { MenuVisibilityManager } from '../../manager/menuVisibilityManager';

@Component({
  selector: 'page-conversationPage',
  templateUrl: 'conversation.html',
})
export class ConversationPage {
  private messageContent: string = '';
  private useSms: boolean = false;
  private subscriptions: Array<Subscription>;
  private connectingPageModal: Modal;
  private connectingPageModalVisible: boolean = false;

  currentConversation: Conversation;

  @ViewChild('footer')
  footer: ElementRef;
  @ViewChild(Content)
  content: Content;

  constructor(
    protected navController: NavController,
    protected navParams: NavParams,
    protected translate: TranslateService,
    protected positionService: PositionService,
    protected networkService: NetworkService,
    protected messageService: MessageService,
    protected configurationService: ConfigurationService,
    protected alertController: AlertController,
    protected conversationManager: ConversationManager,
    protected insomnia: Insomnia,
    protected timerManager: TimerManager,
    protected modalController: ModalController,
    protected sipService: SipService,
    protected subscriptionManager: SubScriptionManager,
    protected menuVisibilityManager:MenuVisibilityManager
  ) {
    this.subscriptions = new Array<Subscription>();
    this.initListener();
    this.insomnia.keepAwake().then(() => console.log('preventing screen from going to sleep'), () => console.log('error initilizing screen sleep prevention'));
  }

  public ionViewWillLeave() {
    this.subscriptionManager.unsubscribe(this.subscriptions);
  }

  public ionViewWillEnter() {
    this.presentConnectingModal();
  }

  public ionViewDidEnter() {
    this.handleNavigationParameter();
    this.sipService.register();
  }

  public onSuggestionsClick() {
    this.presentSuggestionsModal();
  }

  public onSendMessageClick() {
    this.sendMessage(this.messageContent, MessageType.MESSAGE_IN_CALL);
  }

  public onEndClick() {
    this.endConversation();
  }

  private handleNavigationParameter() {
    var sendSms: boolean = this.navParams.get(NavigationParameter.SEND_VIA_SMS.toString());
    if (sendSms != undefined) {
      this.useSms = true;
    }
  }

  private sendMessage(message: string, messageType: MessageType) {
    var userConfiguration = this.configurationService.getConfiguration().getUserConfiguration();
    this.messageService.sendMessage(userConfiguration.getPublicIdentity(), message, true, messageType);
    this.clearMessageText();
  }

  private clearMessageText() {
    this.messageContent = '';
  }

  private initListener() {
    this.subscriptions.push(
      this.messageService.getMessageReceivedErrorEvent().subscribe(evt => {
        this.presentErrorAlert();
      })
    );
    this.subscriptions.push(
      this.conversationManager.getConversationChangeEvent().subscribe(conversation => {
        this.onConversationChanged(conversation);
      })
    );
    this.subscriptions.push(
      this.networkService.getNetworkDisconnectedEvent().subscribe(evt => {
        this.useSms = true;
      })
    );
    this.subscriptions.push(
      this.networkService.getNetworkConnectedEvent().subscribe(evt => {
        this.useSms = false;
      })
    );
    this.subscriptions.push(
      this.timerManager.getTimerElapsedEvent().subscribe((evt: TimerManagerElapsedEventArgs) => {
        if (evt.identifier === TimerIdentifier.POSITION_INTERVAL) {
          this.sendMessage(null, MessageType.MESSAGE_IN_CALL);
        }
      })
    );
    this.subscriptions.push(
      this.messageService.getEndCallEvent().subscribe(evt => {
        this.presentEndConversationByCallCenterConfirm();
      })
    );
    this.timerManager.setInterval(
      TimerIdentifier.POSITION_INTERVAL,
      this.configurationService
        .getConfiguration()
        .getSipConfiguration()
        .getHeartBeat() * TimeConstant.MILLISECONDS_PER_SECOND
    );
    this.subscriptions.push(
      this.sipService.getSipRegisteredEvent().subscribe(evt => {
        this.dismissConnectingModal();
        const message = this.createTemplateMessage('START_CONVERSATION');
        this.sendMessage(message, MessageType.START_CALL);
      })
    );
    this.subscriptions.push(
      this.sipService.getSipMessageSentEvent().subscribe(evt => {
        this.dismissConnectingModal();
      })
    );
  }

  private dismissConnectingModal() {
    if (this.connectingPageModalVisible) {
      this.connectingPageModal.dismiss()
      this.connectingPageModalVisible = false;
    }
  }

  private onConversationChanged(conversation) {
    this.setConversation(conversation);
  }

  private setConversation(conversation) {
    this.currentConversation = conversation;
    this.content.scrollTo(0, this.content.scrollHeight + this.footer.nativeElement.clientHeight, 200);
  }

  private endConversation() {
    this.presentEndConversationConfirm();
  }

  private createTemplateMessage(templateIdentifier: string) {
    var userConfiguration = this.configurationService.getConfiguration().getUserConfiguration();
    var messageTemplate = _.template(this.translate.instant(templateIdentifier));
    return messageTemplate({
      userName: userConfiguration.getFullName(),
      userPhone: userConfiguration.getPhoneNumber(),
      sendDate: moment().format('L'),
      sendTime: moment().format('LTS'),
      position: MessageUtils.formatPosition(
        this.positionService.getPosition(),
        this.translate.instant(LocalizationProperty.LATITUDE_SHORT.toString()),
        this.translate.instant(LocalizationProperty.LONGITUDE_SHORT.toString())
      ),
    });
  }

  private presentEndConversationByCallCenterConfirm() {
    let alert = this.alertController.create({
      title: this.translate.instant(LocalizationProperty.END.toString()),
      message: this.translate.instant(LocalizationProperty.END_CALL_CALLCENTER_INFO.toString()),
      buttons: [
        {
          text: this.translate.instant(LocalizationProperty.OK.toString()),
          handler: () => {
            this.handleConversationEndClicked();
          },
        },
      ],
    });
    alert.present();
  }

  private presentEndConversationConfirm() {
    let alert = this.alertController.create({
      title: this.translate.instant(LocalizationProperty.END.toString()),
      message: this.translate.instant(LocalizationProperty.END_CALL_INFO.toString()),
      buttons: [
        {
          text: this.translate.instant(LocalizationProperty.YES.toString()),
          handler: () => {
            this.handleConversationEndClicked();
          },
        },
        {
          text: this.translate.instant(LocalizationProperty.NO.toString()),
          role: 'cancel',
        },
      ],
    });
    alert.present();
  }

  private presentErrorAlert() {
    let alert = this.alertController.create({
      title: this.translate.instant(LocalizationProperty.ERROR.toString()),
      subTitle: this.translate.instant(LocalizationProperty.SIP_ERROR.toString()),
      buttons: [this.translate.instant(LocalizationProperty.OK.toString())],
    });
    alert.present();
  }

  private handleConversationEndClicked() {
    var message = this.createTemplateMessage(LocalizationProperty.END_CONVERSATION.toString());
    this.sendMessage(message, MessageType.END_CALL);
    this.messageService.endConversation();
    this.timerManager.stopInterval(TimerIdentifier.POSITION_INTERVAL);
    this.menuVisibilityManager.showMenu();
    this.navController.setRoot(MainPage);
  }

  private presentSuggestionsModal() {
    let modal = this.modalController.create(SuggestionsPage);
    modal.onDidDismiss((data: DismissSuggestionsEventArgs) => {
      if (data) {
        if (data.sendImmediately) {
          this.sendMessage(data.text, MessageType.MESSAGE_IN_CALL);
        } else {
          this.messageContent += ' ' + data.text;
        }
      }
    });
    modal.present();
  }

  private presentConnectingModal() {
    if (!this.connectingPageModal) {
      this.connectingPageModal = this.modalController.create(ConnectingPage);
      this.connectingPageModal.onDidDismiss(data => {
        if (data && data.cancelCall) {
          this.handleConversationEndClicked();
        }
      });
    }
    this.connectingPageModal.present();
    this.connectingPageModalVisible = true;
  }
}
