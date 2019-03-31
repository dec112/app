import { Component } from '@angular/core';
import { ViewController } from 'ionic-angular';
import { DismissSuggestionsEventArgs } from '../../../models/eventArgs/dismissSuggestionsEventArgs';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'page-suggestions',
  templateUrl: 'suggestions.html',
})
export class SuggestionsPage {
  constructor(protected translate: TranslateService, protected viewController: ViewController) {}

  protected sendSuggestionsImmediatelyClick(text: string) {
    this.viewController.dismiss(new DismissSuggestionsEventArgs(true, this.translate.instant(text)));
  }

  protected copySuggestionsClick(text: string) {
    this.viewController.dismiss(new DismissSuggestionsEventArgs(false, this.translate.instant(text)));
  }

  protected onCloseClick() {
    this.viewController.dismiss();
  }
}
