import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApolloQueryResult } from '@apollo/client/core';
import { TranslateService } from '@ngx-translate/core';
import {
  OrdersListQuery,
  OrderStatus,
} from '@ridy/admin-panel/generated/graphql';
import { TagColorService } from '@ridy/admin-panel/src/app/@services/tag-color/tag-color.service';
import { NzTableFilterList } from 'ng-zorro-antd/table';
import { map, Observable } from 'rxjs';
import { TableService } from '../../../@services/table-service';

@Component({
  selector: 'app-requests-list',
  templateUrl: './requests-list.component.html',
})
export class RequestsListComponent implements OnInit {
  statuses: NzTableFilterList = Object.values(OrderStatus).map((key) => ({
    value: key,
    text: this.translate.instant(`enum.request.${key}`),
  }));
  query?: Observable<ApolloQueryResult<OrdersListQuery>>;
  dateRanges: Date[] = [];
  orderStatus = OrderStatus;

  // Placeholder filters for Vehicle Type and Loaders Count
  vehicleTypes: NzTableFilterList = [
    { text: 'Pickup', value: 'pickup' },
    { text: 'Van', value: 'van' },
    { text: 'Truck', value: 'truck' },
    { text: 'Covered Truck', value: 'covered-truck' }
  ];
  loaderCounts: NzTableFilterList = [
    { text: '0', value: 0 },
    { text: '1', value: 1 },
    { text: '2', value: 2 }
  ];


  constructor(
    public tagColor: TagColorService,
    private route: ActivatedRoute,
    public tableService: TableService,
    private translate: TranslateService,
  ) { }

  ngOnInit(): void {
    this.query = this.route.data.pipe(map((data) => data.orders));
  }
}