import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-setting-menu',
  templateUrl: './setting-menu.component.html',
  styleUrls: ['./setting-menu.component.less']
})
export class SettingMenuComponent implements OnInit {
  @Input() order: number;
  systemBelong: any;
  constructor(
    private router: Router,
  ) {
    //获取系统所属
    this.systemBelong = localStorage.getItem('footerMessage');
  }
  ngOnInit() {
  }
  goUrl(url: string) {
    this.router.navigateByUrl(url);
  }

}
