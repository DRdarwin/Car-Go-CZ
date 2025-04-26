import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApolloQueryResult } from '@apollo/client/core';
import { ExportGQL, ExportTable, ExportType, RiderWalletsListQuery } from '@ridy/admin-panel/generated/graphql'; // Keeping original GQL type name for now
import { environment } from '@ridy/admin-panel/src/environments/environment';
import { NzTableFilterList } from 'ng-zorro-antd/table';
import { firstValueFrom, map, Observable } from 'rxjs';
import { TableService } from '../../../@services/table-service';

@Component({
    selector: 'app-customer-wallets', // Updated selector
    templateUrl: './customer-wallets-list.component.html'
})
export class CustomerWalletsListComponent implements OnInit { // Renamed class
    query?: Observable<ApolloQueryResult<RiderWalletsListQuery>>; // Keeping original GQL type name for now
    amountRange: number[] = [-1, -1];
    currencies?: Observable<NzTableFilterList>;

    constructor(
        private route: ActivatedRoute,
        public tableService: TableService,
        private exportGql: ExportGQL
    ) { }

    ngOnInit(): void {
        this.query = this.route.data.pipe(map(data => data.riderWallet)); // Keep resolver key 'riderWallet' for now
        this.currencies = this.query.pipe(map(data => this.distinctCurrency(data.data.regions.nodes).map(currency => ({ text: currency, value: currency }))))
    }

    async exportTo(type: string) {
        // TODO: Update ExportTable enum on backend if needed
        const result = await firstValueFrom(this.exportGql.fetch({ input: { table: ExportTable.RiderWallet, type: ExportType.Csv, relations: ['rider'] } }));
        this.tableService.downloadURI(environment.root + result.data.export.url, `export-customers-${new Date().getTime()}.csv`); // Updated filename
    }

    distinctCurrency(array: { currency: string }[]): string[] {
        return array.map(item => item.currency).filter((v, i, a) => a.indexOf(v) === i);
    }
}