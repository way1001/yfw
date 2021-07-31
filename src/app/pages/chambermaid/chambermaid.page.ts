import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CustomersService } from '../customers/customers.service';

@Component({
  selector: 'app-chambermaid',
  templateUrl: './chambermaid.page.html',
  styleUrls: [
    './styles/chambermaid.page.scss',
    './styles/chambermaid.shell.scss'
  ]
})
export class ChambermaidPage implements OnInit {
  // Gather all component subscription in one place. Can be one Subscription or multiple (chained using the Subscription.add() method)
  // subscriptions: Subscription;

  // @HostBinding('class.is-shell') get isShell() {
  //   return (this.details && this.details.isShell) ? true : false;
  // }
  customerList;

  constructor(private route: ActivatedRoute,
    private customersService: CustomersService) { }

  ngOnInit(): void {

    this.customersService.getListByChambermaid().subscribe(
      res =>  {
        this.customerList = res
      });
    // this.subscriptions = this.route.data
    // .pipe(
    //   // Extract data for this page
    //   switchMap((resolvedRouteData: IResolvedRouteData<FoodDetailsModel>) => {
    //     return ResolverHelper.extractData<FoodDetailsModel>(resolvedRouteData.data, FoodDetailsModel);
    //   })
    // )
    // .subscribe((state) => {
    //   this.details = state;
    // }, (error) => console.log(error));
  }

  // NOTE: Ionic only calls ngOnDestroy if the page was popped (ex: when navigating back)
  // Since ngOnDestroy might not fire when you navigate from the current page, use ionViewWillLeave to cleanup Subscriptions
  ionViewWillLeave(): void {
    // this.subscriptions.unsubscribe();
  }
}
