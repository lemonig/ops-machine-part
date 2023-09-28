import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';

import { WarehouseRoutingModule } from './warehouse-routing.module';
import { AlarmComponent } from './alarm/alarm.component';
import { NoticeComponent } from './notice/notice.component';
import { SafeComponent } from './safe/safe.component';
import { SupplyComponent } from './supply/supply.component';


@NgModule({
  declarations: [AlarmComponent, NoticeComponent, SafeComponent, SupplyComponent],
  imports: [
    CommonModule,
    WarehouseRoutingModule,
    SharedModule
  ]
})
export class WarehouseModule { }
