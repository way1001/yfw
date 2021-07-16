import { OnInit } from '@angular/core';
import { Component, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { AllocationService } from '../allocation/allocation.service';

@Component({
  selector: 'app-intention-page',
  templateUrl: 'intention.page.html',
  styleUrls: [
    './styles/intention.page.scss'
  ]
})

export class IntentionPage implements OnInit{
  validationsForm: FormGroup;

  intention: [];
  @Input() referralsId;

  validations = {
    'title': [
      { type: 'required', message: '标题不能为空' }
    ],
    'details': [
      { type: 'required', message: '内容不能为空' }
    ]
  };

  constructor(private modalController: ModalController,
    private allocationService: AllocationService,) { }

  ngOnInit(): void {
    this.validationsForm = new FormGroup({
      
      'title': new FormControl('', Validators.required),
      'details': new FormControl('', Validators.required)
    });
    
  }

  dismiss(): void {
    this.modalController.dismiss();
  }

  // passDismiss() {
  //   // using the injected ModalController this page
  //   // can "dismiss" itself and optionally pass back data
  //   this.modalController.dismiss({
  //       'intention': this.intention
  //   });

  // }

  onSubmit(values) {
    if (!this.referralsId) {
      return;
    }

    const intentionTmp = this.validationsForm.controls.title.value + '|' +this.validationsForm.controls.details.value

    this.allocationService.addIntention(this.referralsId, intentionTmp).subscribe(
      res => {
        if (res.ok) {
          this.intention = res.data;
          this.modalController.dismiss({
            'intention': this.intention
        });
        }
      })
  }
}
