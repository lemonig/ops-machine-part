import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';

import { ReconcileRoutingModule } from './reconcile-routing.module';
import { HistoryComponent } from './history/history.component';
import { LedgerComponent } from './ledger/ledger.component';
import { SummaryComponent } from './summary/summary.component';


@NgModule({
  declarations: [HistoryComponent, LedgerComponent, SummaryComponent],
  imports: [
    CommonModule,
    ReconcileRoutingModule,
    SharedModule
  ]
})
export class ReconcileModule { }
