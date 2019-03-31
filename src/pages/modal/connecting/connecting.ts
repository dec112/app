import { Subscription } from 'rxjs';
import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { TimerManager } from '../../../manager/timerManager';
import { TimerIdentifier } from '../../../constants/timerIdentifier';

@Component({
  selector: 'page-connectingPage',
  templateUrl: 'connecting.html',
})
export class ConnectingPage {
  private slowlyLoadingTimerSubscription: Subscription;
  public slowlyLoading: boolean = false;

  constructor(protected translate: TranslateService, protected viewController: ViewController, protected timerManager: TimerManager) {}

  public ionViewDidEnter() {
    this.slowlyLoading = false;
    this.slowlyLoadingTimerSubscription = this.timerManager.getTimerElapsedEvent().subscribe(data => {
      this.slowlyLoading = true;
    });
    this.timerManager.setTimeout(TimerIdentifier.SLOWLY_LOADING_TIMEOUT, 5000);
  }

  public ionViewWillLeave() {
    this.slowlyLoadingTimerSubscription.unsubscribe();
  }

  public onCloseCallClick(){
    this.viewController.dismiss({cancelCall: true});
  }
}
