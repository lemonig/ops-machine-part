import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';

import { PartRoutingModule } from './part-routing.module';
import { ApplicateComponent } from './applicate/applicate.component';
import { LedgerComponent } from './ledger/ledger.component';
import { StatisComponent } from './statis/statis.component';
import { ShipmentsComponent } from './shipments/shipments.component';
import { VerifiedComponent } from './verified/verified.component';


@NgModule({
  declarations: [ApplicateComponent, LedgerComponent, StatisComponent, ShipmentsComponent, VerifiedComponent],
  imports: [
    CommonModule,
    PartRoutingModule,
    SharedModule
  ]
})
export class PartModule { }
