import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CanActivateService } from '../../core/canActivate/can-activate.service';

import { AlarmComponent } from './alarm/alarm.component'
import { NoticeComponent } from './notice/notice.component'
import { SafeComponent } from './safe/safe.component'
import { SupplyComponent } from './supply/supply.component'

const routes: Routes = [
  { path: 'alarm', component: AlarmComponent, canActivate: [CanActivateService] },
  { path: 'notice', component: NoticeComponent, canActivate: [CanActivateService] },
  { path: 'safe', component: SafeComponent, canActivate: [CanActivateService] },
  { path: 'supply', component: SupplyComponent, canActivate: [CanActivateService] },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WarehouseRoutingModule { }
