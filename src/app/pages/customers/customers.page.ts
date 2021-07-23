import { Component, OnInit, HostBinding } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { CustomersService } from './customers.service';

@Component({
  selector: 'app-user-friends',
  templateUrl: './customers.page.html',
  styleUrls: [
    './styles/customers.page.scss',
    './styles/customers.shell.scss',
    './styles/customers.ios.scss',
    './styles/customers.md.scss'
  ]
})
export class CustomersPage implements OnInit {
  // Gather all component subscription in one place. Can be one Subscription or multiple (chained using the Subscription.add() method)
  // subscriptions: Subscription;

  // friendsList: Array<any> = [];
  // followersList: Array<any> = [];
  // followingList: Array<any> = [];
  searchQuery = '';
  showFilters = false;
  userRole;
  affiliated: Array<String>;
  page = {
    searchCount: false,
    current: 1,
    size: 200,
    ascs: '',
    //升序字段
    descs: 'create_time'
  };
  parameter = {};
  customersList: Array<any> = [];

  activeList: Array<any>;
  endList: Array<any>;


  //空值过滤器
  segmentValue = 'activating';


  state = {
    refreshState: {
      currentState: 'deactivate',
      drag: false
    },
    direction: '',
    endReachedRefresh: false,
    height: 500,
    data: [],
    directionName: 'both up and down'
  };


  constructor(private route: ActivatedRoute,
    private router: Router,
    private customersService: CustomersService) {
    this.userRole = localStorage.getItem('userRole');
    this.affiliated = localStorage.getItem('affiliated').split(',');

    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    const filterForm = (form) => {
      let obj = {};
      Object.keys(form).forEach(ele => {
        if (!this.validatenull(form[ele])) {
          obj[ele] = form[ele]
        }
      });
      return obj;
    }

    let combination = {}
    if (!this.userRole || this.userRole == '') {
      combination = {
        brokerId: currentUser?.mktUserId,
      }
    } else if (this.userRole === 'access' || this.userRole === 'manager') {
      combination = {
        affiliationId: this.affiliated[0],
      }
    } else if (this.userRole === 'salesman') {
      combination = {
        salesmanId: currentUser?.mktUserId,
      }
    } else if (this.userRole === 'secretary') {
      return
    }

    // if (!this.userRole || this.userRole != '') {
    this.customersService.getPageByOwn(Object.assign(
      combination,
      this.page,
      filterForm(this.parameter))).subscribe(
        res => {
          let [...customersList] = res.data.records;
          let tempArr = [], newArr = []
          for (let i = 0; i < customersList.length; i++) {
            if (tempArr.indexOf(customersList[i].phone) === -1) {
              // newArr.push({
              //   id: customersList[i].id,
              //   list: [customersList[i].list]
              // })
              newArr.push(customersList[i]);
              tempArr.push(customersList[i].phone);
            } else {
              // for (let j = 0; j < newArr.length; j++) {
              //   if (newArr[j].phone == customersList[i].phone) {
              //     newArr[j].list.push(customersList[i].list)
              //   }
              // }
            }
          }

          this.customersList = [...this.customersList, ...newArr];

          this.searchList();
          if (customersList.length < this.page.size) {
            // this.setData({
            //   loadmore: false
            // })
          }
        }
      )
    // }
  }

  ngOnInit(): void {

  }

  segmentChanged(ev): void {
    this.segmentValue = ev.detail.value;

    // Check if there's any filter and apply it
    this.searchList();
  }


  searchList(): void {
    const query = (this.searchQuery && this.searchQuery !== null) ? this.searchQuery : '';

    if (this.segmentValue === 'activating') {
      this.activeList = this.filterList(this.customersList, '0', query);
    } else if (this.segmentValue === 'ending') {
      this.endList = this.filterList(this.customersList, '1', query);
    }
  }

  filterList(list, status, query): Array<any> {
    return list.filter(item => item.workflowStatus === status &&
      (item.customerName.toLowerCase().includes(query.toLowerCase()) ||
        item.phone.toLowerCase().includes(query.toLowerCase())));
  }

  // NOTE: Ionic only calls ngOnDestroy if the page was popped (ex: when navigating back)
  // Since ngOnDestroy might not fire when you navigate from the current page, use ionViewWillLeave to cleanup Subscriptions
  ionViewWillLeave(): void {
    // this.subscriptions.unsubscribe();
  }

  validatenull(val) {
    if (typeof val === 'boolean') {
      return false
    }
    if (typeof val === 'number') {
      return false
    }
    if (val instanceof Array) {
      if (val.length == 0) return true
    } else if (val instanceof Object) {
      if (JSON.stringify(val) === '{}') return true
    } else {
      if (val == 'null' || val == null || val == 'undefined' || val == undefined || val == '') return true
      return false
    }
    return false
  }


  // pullToRefresh(event) {
  //   if (event === 'endReachedRefresh') {
  //     if (this.page < 9) {
  //       this.page++;
  //       this.addItems(this.page * this.pageLimit);
  //       this.state.refreshState.currentState = 'release';
  //       setTimeout(() => {
  //         this.state.refreshState.currentState = 'finish';
  //       }, 1000);
  //     }
  //   }
  // }

  details(id) {
    this.router.navigate(['/app/referrals/', id]);
  }
}
