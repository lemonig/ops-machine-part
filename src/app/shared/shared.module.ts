/*
 * @Author: 李大钊
 * @Date: 2022-05-09 14:24:03
 * @LastEditors: 李大钊
 * @LastEditTime: 2022-05-16 11:56:40
 * @FilePath: \electron-fence\src\app\shared\shared.module.ts
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
// delon
import { AlainThemeModule } from '@delon/theme';
//组件
import { NgZorroAntdModule } from 'ng-zorro-antd';

//拖拽cdk
import { DragDropModule } from '@angular/cdk/drag-drop';
//table滚动
import { TableScrollDirective } from './table-scroll.directive';
//站点树

const THIRDMODULES = [NgZorroAntdModule];

import { NgxEchartsModule } from 'ngx-echarts';
import { MultiTitleScrollDirective } from './multi-title-scroll.directive';
//input去空格
import { InputTrimDirective } from './input-trim.directive';

//设置菜单
import { SettingMenuComponent } from './setting-menu/setting-menu.component';

//判断table滚动的高度
import { TableHeightDirective } from './table-height.directive';

// 查询条件


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
    AlainThemeModule.forChild(),
    ...THIRDMODULES,
    NgxEchartsModule,
    DragDropModule,
  ],
  declarations: [
    TableScrollDirective,
    MultiTitleScrollDirective,
    InputTrimDirective,
    SettingMenuComponent,
    TableHeightDirective,

  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    AlainThemeModule,
    ...THIRDMODULES,

    TableScrollDirective,
    MultiTitleScrollDirective,
    NgxEchartsModule,
    InputTrimDirective,
    SettingMenuComponent,
    DragDropModule,
    TableHeightDirective,

  ],
})
export class SharedModule { }
