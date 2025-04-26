import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomerWalletsRoutingModule } from './customer-wallets-routing.module'; // Renamed import
import { CustomerWalletsListComponent } from './customer-wallets-list.component'; // Renamed import
import { SharedModule } from '@ridy/admin-panel/src/app/@components/shared.module';


@NgModule({
    declarations: [CustomerWalletsListComponent], // Renamed component
    imports: [
        CommonModule,
        CustomerWalletsRoutingModule, // Renamed module
        SharedModule
    ]
})
export class CustomerWalletsModule { } // Renamed class