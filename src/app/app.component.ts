/*
 * @Author: 李大钊
 * @Date: 2022-05-09 14:24:02
 * @LastEditors: 李大钊
 * @LastEditTime: 2022-05-16 10:35:27
 * @FilePath: \electron-fence\src\app\app.component.ts
 */
import { Component, OnInit, Renderer2, ElementRef } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { VERSION as VERSION_ALAIN, TitleService } from '@delon/theme';
import { VERSION as VERSION_ZORRO, NzModalService } from 'ng-zorro-antd';

@Component({
  selector: 'app-root',
  template: `
    <router-outlet></router-outlet>
    <!-- <nz-affix style="position: fixed; bottom: 40px; right: 20px;z-index:999999">
      <a target="_blank" href="https://support.qq.com/product/185218">
        <img style="width:40px;" src="assets/tmp/img/feedBack.png">
      </a>
    </nz-affix> -->
  `,
})
export class AppComponent implements OnInit {
  constructor(
    el: ElementRef,
    renderer: Renderer2,
    private router: Router,
    private titleSrv: TitleService,
    private modalSrv: NzModalService,
  ) {
    renderer.setAttribute(el.nativeElement, 'ng-alain-version', VERSION_ALAIN.full);
    renderer.setAttribute(el.nativeElement, 'ng-zorro-version', VERSION_ZORRO.full);
  }

  ngOnInit() {
    this.router.events.pipe(filter(evt => evt instanceof NavigationEnd)).subscribe(() => {
      this.titleSrv.setTitle();
      this.modalSrv.closeAll();
    });
  }
}
