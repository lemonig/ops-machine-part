import { Injectable, Inject } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';
import { _HttpClient } from '@delon/theme';
import { HttpClient, HttpHeaders } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class CanActivateService {
  urlList: any[] = [];
  constructor(
    public msg: NzMessageService,
    @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService,
    public _http: _HttpClient,
  ) { }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    // this.getTicket()
    const authData = this.tokenService.get();
    if (!!authData && typeof authData === 'object') {
      console.log('登录失效');
      return true //TODO 放开 跳转登录页
    }
    this.urlList = JSON.parse(localStorage.getItem('menuList')) || [];
    if (this.urlList && this.urlList.includes(state.url)) {
      return true;
    } else {
      this.msg.error('菜单访问受限!')
      return true; //TODO 放开
    }
  }



}
