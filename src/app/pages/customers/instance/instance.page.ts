import { Component, Input, OnInit } from '@angular/core';
import { TransactService } from '@app/pages/transact/transact.service';
import { ModalController } from '@ionic/angular';
import { CustomersService } from '../customers.service';

@Component({
  selector: 'app-instance-page',
  templateUrl: 'instance.page.html',
  styleUrls: [
    './styles/instance.page.scss'
  ]
})

export class InstancePage implements OnInit{
  @Input() instanceId: string;

  steps = [];
  current = 0;
  index = 'First-content';

  taskList;
  currentReferrals;
  trackRecord;

  constructor(private modalController: ModalController,
    private customersService: CustomersService,
    private transactService: TransactService) { }

  ngOnInit(): void {
    this.steps = [
      {
        title: '审核',
      },
      {
        title: '跟办',
      },
      {
        title: '到期',
      }
    ];
    if (this.instanceId) {

      this.transactService.getCurrentReferrals(this.instanceId).subscribe(
        res => {
          if (res.ok) {
            this.currentReferrals = res.data
            if (this.currentReferrals?.workflowStatus != '1') {
              if (this.currentReferrals?.currentHandler === '楼盘判客') {
                this.current = 0;
              } else {
                this.current = 1;
              }
            } else {
              this.current = 2;
            }
           
            if (this.currentReferrals) {
              this.customersService.getListRef(this.currentReferrals.id).subscribe(
                data => {
                  if (data.ok) {
                    //
                    this.trackRecord = data.data;

                  }
                }
              )
            }
          }
        }
      )

      this.customersService.getHistoryTaskByInstanceId(this.instanceId, "startTime", "asc").subscribe(
        resp => {
          this.taskList = resp;
          if (this.taskList.length > 0) {
            if (this.taskList[this.taskList.length - 1]?.name === '楼盘判客' && this.taskList[this.taskList.length - 1]?.deleteReason === 'completed') {
              this.current = 1;
            }
          }
        }
      )
    }
  }

  dismiss(): void {
    this.modalController.dismiss();
  }
}
