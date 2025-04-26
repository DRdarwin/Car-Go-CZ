import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CustomerWalletsListComponent } from './customer-wallets-list.component'; // Renamed import
import { CustomerWalletsListResolver } from './customer-wallets-list.resolver'; // Renamed import


const routes: Routes = [
    { path: '', component: CustomerWalletsListComponent, resolve: { riderWallet: CustomerWalletsListResolver }, runGuardsAndResolvers: 'paramsOrQueryParamsChange' } // Renamed component and resolver
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
    providers: [
        CustomerWalletsListResolver // Renamed resolver
    ]
})
export class CustomerWalletsRoutingModule { } // Renamed class