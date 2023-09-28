import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';

import { LayoutDefaultComponent } from './default/default.component';
import { LayoutFullScreenComponent } from './fullscreen/fullscreen.component';
import { HeaderComponent } from './default/header/header.component';
import { HeaderFullScreenComponent } from './default/header/components/fullscreen.component';
import { HeaderUserComponent } from './default/header/components/user.component';

const SETTINGDRAWER = [];
const COMPONENTS = [
  LayoutDefaultComponent,
  LayoutFullScreenComponent,
  HeaderComponent,
  ...SETTINGDRAWER,
];

const HEADERCOMPONENTS = [
  HeaderFullScreenComponent,
  HeaderUserComponent,
];

// passport
import { LayoutPassportComponent } from './passport/passport.component';
const PASSPORT = [LayoutPassportComponent];

@NgModule({
  imports: [SharedModule],
  entryComponents: SETTINGDRAWER,
  declarations: [...COMPONENTS, ...HEADERCOMPONENTS, ...PASSPORT],
  exports: [...COMPONENTS, ...PASSPORT],
})
export class LayoutModule { }
