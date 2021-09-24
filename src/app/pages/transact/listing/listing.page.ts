import { OnInit } from '@angular/core';
import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { TransactService } from '../transact.service';

@Component({
  selector: 'app-listing-page',
  templateUrl: 'listing.page.html',
  styleUrls: [
    './styles/listing.page.scss'
  ]
})

export class ListingPage implements OnInit{
  @Input() assignee;

  transactList;

  constructor(private modalController: ModalController,
    private transactService: TransactService,
    private router: Router) {
     }

  ngOnInit(): void {
    if (!this.assignee) {
      return;
    }
    this.transactService.getTransactList(this.assignee).subscribe(
      res => {
        this.transactList = res;
      }
    )
  }

  dismiss(): void {
    this.modalController.dismiss();
  }

  onSubmit(values) {
    if (!this.assignee) {
      return;
    }
  }

  toTransact(tr) {
    if (tr) {
      if (tr?.name === '楼盘判客') {
        this.router.navigate(['/transact/', tr?.processInstanceId]);
      } else if (tr?.name === '经理审核') {
        this.router.navigate(['/allocation/', tr?.processInstanceId]);
      } else if (tr?.name === '到访审核') {
        this.router.navigate(['/visit-audit/', tr?.processInstanceId]);
      }
    }
    this.modalController.dismiss();
  }


}
