import { Component, OnInit } from '@angular/core';
import { SettingsService } from '@delon/theme';
import { _HttpClient } from '@delon/theme';
import { NzMessageService } from 'ng-zorro-antd';

@Component({
  selector: 'layout-passport',
  templateUrl: './passport.component.html',
  styleUrls: ['./passport.component.less'],
})
export class LayoutPassportComponent implements OnInit {
  year: any = new Date().getFullYear();

  constructor(
    public settingService: SettingsService,
    public _http: _HttpClient,
    public msg: NzMessageService,
  ) {
  }
  company: any;
  systemName: any;
  ngOnInit() {
  }
}
