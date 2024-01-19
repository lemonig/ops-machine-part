import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CanActivateService } from '../../core/canActivate/can-activate.service';

import { CategaryComponent } from './categary/categary.component'
import { LedgerComponent } from './ledger/ledger.component'
import { UserComponent } from './user/user.component'
import { PackageComponent } from './package/package.component'
import { DeviceComponent } from './device/device.component'

const routes: Routes = [
  { path: '', component: LedgerComponent, canActivate: [CanActivateService] },
  { path: 'categary', component: CategaryComponent, canActivate: [CanActivateService] },
  { path: 'ledger', component: LedgerComponent, canActivate: [CanActivateService] },
  { path: 'user', component: UserComponent, canActivate: [CanActivateService] },
  { path: 'package', component: PackageComponent, canActivate: [CanActivateService] },
  { path: 'device', component: DeviceComponent, canActivate: [CanActivateService] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingRoutingModule { }
