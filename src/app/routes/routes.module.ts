/*
 * @Author: 李大钊
 * @Date: 2022-05-09 14:24:02
 * @LastEditors: 李大钊
 * @LastEditTime: 2022-05-09 15:58:49
 * @FilePath: \electron-fence\src\app\routes\routes.module.ts
 */
import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { RouteRoutingModule } from './routes-routing.module';

// passport pages
import { UserLoginComponent } from './passport/login/login.component';
import { ErrorPageComponent } from './error-page/error-page.component';






const COMPONENTS = [
  // passport pages
  UserLoginComponent,
];
const COMPONENTS_NOROUNT = [];

@NgModule({
  imports: [SharedModule, RouteRoutingModule],
  declarations: [...COMPONENTS, ...COMPONENTS_NOROUNT, ErrorPageComponent,],
  entryComponents: COMPONENTS_NOROUNT,
})
export class RoutesModule { }
