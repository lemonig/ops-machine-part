import { SettingsService, _HttpClient } from '@delon/theme';
import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd';
import { CanActivateService } from '../../../core/canActivate/can-activate.service';
import {
  TokenService, DA_SERVICE_TOKEN,
} from '@delon/auth';
// import md5 from 'md5';
@Component({
  selector: 'passport-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less'],
})
export class UserLoginComponent implements OnInit {
  public loginForm: FormGroup;
  public btnLoading: boolean = false;

  constructor(
    fb: FormBuilder,
    private router: Router,
    private settingsService: SettingsService,
    public _http: _HttpClient,
    public msg: NzMessageService,
    @Inject(DA_SERVICE_TOKEN) private tokenService: TokenService,
    public canActivateService: CanActivateService,
  ) {
    this.loginForm = fb.group({
      username: [null, Validators.required],
      password: [null, Validators.required],
    });
  }
  ngOnInit() {
  }

  submit() {
    for (const i in this.loginForm.controls) {
      this.loginForm.controls[i].markAsDirty();
      this.loginForm.controls[i].updateValueAndValidity();
    }
    if (this.loginForm.invalid) {
      return
    }
    let params = this.loginForm.value;
    this.btnLoading = true;
    this._http.post('api/login', params).subscribe((res: any) => {
      this.btnLoading = false;
      if (res.success) {
        const token = {
          token: res.data.access_token,
          name: res.data.nickname,
        };
        const userInfo = {
          avatar: res.data.avatar,
          name: res.data.nickname,
        }
        this.tokenService.set(token);
        this.settingsService.setUser(userInfo);
        localStorage.setItem('userInfo', JSON.stringify(userInfo));
        localStorage.setItem('hasUserMenu', res.data.isTenantOwner)
        //跳转页面
        this.router.navigateByUrl('/part/applicate');
        //获取权限
        // this._http.get('api/setting/menu/manager/tree/view').subscribe((res: any) => {
        //   if (res.success) {
        //     //有没有菜单权限
        //     if (res.data && res.data.length) {
        //       //权限保存在localstorage
        //       localStorage.setItem('menuPower', JSON.stringify(res.data));
        //       //跳转到第一个路由
        //       let firstUrl = this.goFirstUrl(res.data);
        //       this.router.navigateByUrl(firstUrl);

        //       //将数据保存在路由守卫中
        //       //初始化数据
        //       this.canActivateService.urlList = [];
        //       this.getUrlList(res.data);
        //       //将路由保存,防止刷新
        //       localStorage.setItem('menuList', JSON.stringify(this.canActivateService.urlList));
        //     } else {
        //       this.msg.error('此账号没有可用菜单!')
        //     }
        //   } else {
        //     this.msg.error(res.message);
        //   }
        // })
      } else {
        this.msg.error(res.message);
      }
    }, () => {
      this.btnLoading = false;
    })
  }
  // goFirstUrl(menuList: any) {
  //   for (let menu of menuList) {
  //     if (menu.children && menu.children.length > 0) {
  //       return this.goFirstUrl(menu.children);
  //     } else {
  //       return menu.link;
  //     }
  //   }
  // }
  // getUrlList(list: any) {
  //   list.map((item: any) => {
  //     if (item.children && item.children.length > 0) {
  //       this.getUrlList(item.children);
  //     } else {
  //       this.canActivateService.urlList.push(item.link);
  //     }
  //   })
  // }
  goRegister() {
    this.router.navigateByUrl('/register');
  }
}
