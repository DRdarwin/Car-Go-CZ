import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { ApolloQueryResult } from '@apollo/client/core';
import {
    RiderTransactionFilter, // Keeping original GQL type name for now
    RiderTransactionSortFields, // Keeping original GQL type name for now
    RiderWalletsListGQL, // Keeping original GQL type name for now
    RiderWalletsListQuery, // Keeping original GQL type name for now
} from '@ridy/admin-panel/generated/graphql';
import { TableService } from '@ridy/admin-panel/src/app/@services/table-service';
import { Observable } from 'rxjs';

@Injectable()
export class CustomerWalletsListResolver { // Renamed class
    constructor(
        private paging: TableService,
        private gql: RiderWalletsListGQL // Keeping original GQL type name for now
    ) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ApolloQueryResult<RiderWalletsListQuery>> { // Keeping original GQL type name for now
        const params = this.paging.deserializeQueryParams<RiderTransactionSortFields, RiderTransactionFilter>(route.queryParams); // Keeping original GQL type name for now
        return this.gql.fetch(params);
    }
}