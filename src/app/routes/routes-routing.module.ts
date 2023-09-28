/*
 * @Author: Jonny
 * @Date: 2023-09-05 10:22:35
 * @LastEditors: Jonny
 * @LastEditTime: 2023-09-05 14:38:10
 * @FilePath: \ops-machine-part\src\app\routes\routes-routing.module.ts
 */

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { environment } from '@env/environment';
// layout
import { LayoutDefaultComponent } from '../layout/default/default.component';
import { LayoutPassportComponent } from '../layout/passport/passport.component';
import { LayoutFullScreenComponent } from '../layout/fullscreen/fullscreen.component';
// passport pages
import { UserLoginComponent } from './passport/login/login.component'
import { ErrorPageComponent } from './error-page/error-page.component';
import { ACLGuard } from '@delon/acl';


import { CanActivateService } from '../core/canActivate/can-activate.service';
const routes: Routes = [
  {
    path: '',
    component: LayoutDefaultComponent,
    children: [
      {
        path: '', redirectTo: '/passport/login', pathMatch: 'full',

      },
      {
        path: 'part',
        loadChildren: () => import('./part/part.module').then(m => m.PartModule),
        data: { guard: 'admin' }
      },
      {
        path: 'reconcile',
        loadChildren: () => import('./reconcile/reconcile.module').then(m => m.ReconcileModule),
        data: { guard: 'admin' }
      }, {
        path: 'warehouse',
        loadChildren: () => import('./warehouse/warehouse.module').then(m => m.WarehouseModule),
        data: { guard: 'admin' }
      }, {
        path: 'setting',
        loadChildren: () => import('./setting/setting.module').then(m => m.SettingModule),
        data: { guard: 'admin' }
      },
    ],
  },
  // error
  {
    path: '403',
    component: ErrorPageComponent
  },

  // passport
  {
    path: 'passport',
    component: LayoutPassportComponent,
    children: [
      {
        path: 'login',
        component: UserLoginComponent,
      }
    ],
    canActivate: [CanActivateService]

  },
  { path: '**', redirectTo: 'passport/login' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      useHash: environment.useHash,
      // NOTICE: If you use `reuse-tab` component and turn on keepingScroll you can set to `disabled`
      // Pls refer to https://ng-alain.com/components/reuse-tab
      scrollPositionRestoration: 'top',
    }),
  ],
  exports: [RouterModule],
})
export class RouteRoutingModule { }
