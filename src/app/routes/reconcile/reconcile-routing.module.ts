import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CanActivateService } from '../../core/canActivate/can-activate.service';

import { HistoryComponent } from './history/history.component'
import { LedgerComponent } from './ledger/ledger.component'
import { SummaryComponent } from './summary/summary.component'

const routes: Routes = [
  { path: 'history', component: HistoryComponent, canActivate: [CanActivateService] },
  { path: 'ledger', component: LedgerComponent, canActivate: [CanActivateService] },
  { path: 'summary', component: SummaryComponent, canActivate: [CanActivateService] },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReconcileRoutingModule { }
