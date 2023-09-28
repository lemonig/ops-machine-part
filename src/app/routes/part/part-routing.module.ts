/*
 * @Author: Jonny
 * @Date: 2023-09-05 10:33:49
 * @LastEditors: Jonny
 * @LastEditTime: 2023-09-05 14:37:13
 * @FilePath: \ops-machine-part\src\app\routes\part\part-routing.module.ts
 */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CanActivateService } from '../../core/canActivate/can-activate.service';

import { ApplicateComponent } from './applicate/applicate.component'
import { LedgerComponent } from './ledger/ledger.component'
import { StatisComponent } from './statis/statis.component'
import { ShipmentsComponent } from './shipments/shipments.component'
import { VerifiedComponent } from './verified/verified.component'

const routes: Routes = [
  { path: '', component: LedgerComponent, canActivate: [CanActivateService] },
  { path: 'applicate', component: ApplicateComponent, canActivate: [CanActivateService] },
  { path: 'ledger', component: LedgerComponent, canActivate: [CanActivateService] },
  { path: 'statis', component: StatisComponent, canActivate: [CanActivateService] },
  { path: 'shipments', component: ShipmentsComponent, canActivate: [CanActivateService] },
  { path: 'verified', component: VerifiedComponent, canActivate: [CanActivateService] },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PartRoutingModule { }
