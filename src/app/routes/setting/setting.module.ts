/*
 * @Author: Jonny
 * @Date: 2023-09-05 10:33:23
 * @LastEditors: Jonny
 * @LastEditTime: 2023-09-05 10:47:41
 * @FilePath: \ops-machine-part\src\app\routes\setting\setting.module.ts
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';

import { SettingRoutingModule } from './setting-routing.module';
import { CategaryComponent } from './categary/categary.component';
import { LedgerComponent } from './ledger/ledger.component';
import { UserComponent } from './user/user.component';


@NgModule({
  declarations: [CategaryComponent, LedgerComponent, UserComponent],
  imports: [
    CommonModule,
    SettingRoutingModule,
    SharedModule
  ]
})
export class SettingModule { }
