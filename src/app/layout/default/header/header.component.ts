import { Component, OnInit } from '@angular/core';
import { SettingsService } from '@delon/theme';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { _HttpClient } from '@delon/theme';
import { NzMessageService } from 'ng-zorro-antd';

@Component({
  selector: 'layout-header',
  templateUrl: './header.component.html',
  styles: []
})
export class HeaderComponent implements OnInit {
  logo: any;
  systemName: any;
  powerObj: any = {};
  constructor(
    public settings: SettingsService,
    public router: Router,
    public activatedRoute: ActivatedRoute,
    public _http: _HttpClient,
    public msg: NzMessageService
  ) { }
  activeUrl: string = '';
  is_admin: boolean = false
  deal_notify: boolean = false

  ngOnInit() {
    //监听路由的活动
    this.router.events.subscribe((res: any) => {
      if (res instanceof NavigationEnd) {
        this.activeUrl = this.activatedRoute.snapshot['_routerState'].url;
      }
    })
    setTimeout(() => {
      this.activeUrl = this.activatedRoute.snapshot['_routerState'].url;
    })
    let user = JSON.parse(localStorage.getItem('user'))
    this.is_admin = user.is_admin;
    this.deal_notify = user.deal_notify;

    //获取系统logo/名称
    // this._http.post(`api/setting/list`).subscribe((res: any) => {
    //   if (res.success) {
    //     this.systemName = res.data.headerName ? res.data.headerName : '';
    //     this.logo = res.data.headerLogo ? res.data.headerLogo : '';
    //   }
    // })
  }
  goUrl(url: any) {
    this.router.navigateByUrl(url);
  }
}
