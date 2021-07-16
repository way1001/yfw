import { Component, ContentChild, AfterViewInit, Input, Output, EventEmitter } from '@angular/core';

import { IonInput } from '@ionic/angular';
import { ToastService } from '@app/core/_service/toast.service';

@Component({
  selector: 'app-show-hide-send',
  templateUrl: './show-hide-send.component.html',
  styleUrls: [
    './show-hide-send.component.scss'
  ]
})
export class ShowHideSendComponent implements AfterViewInit {
  show = true;

  @ContentChild(IonInput) input: IonInput;

  @Output() sendSuccess = new EventEmitter();

  @Input() associationId: any;
  @Input() isAnonymous: any;

  constructor(private toastService: ToastService) {}

  ngAfterViewInit() {
    this.show = this.input.value ? false : true;
    this.input.ionChange.subscribe( ev => {
      this.show = ev.detail.value ? false : true;
    })
  }

  sendComment() {
    if (this.input.value) {
      // this.discService.sendComment('3', this.input.value, this.associationId, this.isAnonymous).subscribe(res => {
      //   this.toastService.presentToast('评论发送成功！')
      //   this.sendSuccess.emit();
      //   this.input.value = '';
      //   this.show = true;
      // })
    }
  }
}
