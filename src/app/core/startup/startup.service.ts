import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { zip } from 'rxjs';
import { catchError } from 'rxjs/operators';
// import { MenuService, SettingsService, TitleService, ALAIN_I18N_TOKEN } from '@delon/theme';
import { SettingsService, TitleService, MenuService } from '@delon/theme';
// import { TranslateService } from '@ngx-translate/core';
// import { I18NService } from '../i18n/i18n.service';
import { _HttpClient } from '@delon/theme';
import { NzIconService } from 'ng-zorro-antd';
import { ICONS_AUTO } from '../../../style-icons-auto';
import { ICONS } from '../../../style-icons';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';

/**
 * 用于应用启动时
 * 一般用来获取应用所需要的基础数据等
 */
@Injectable()
export class StartupService {
  constructor(
    iconSrv: NzIconService,
    private menuService: MenuService,
    // private translate: TranslateService,
    // @Inject(ALAIN_I18N_TOKEN) private i18n: I18NService,
    private settingService: SettingsService,
    private titleService: TitleService,
    private httpClient: HttpClient,
    public _http: _HttpClient,
    @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService,
  ) {
    iconSrv.addIcon(...ICONS_AUTO, ...ICONS);
  }

  async load(): Promise<any> {
    // only works with promises
    // https://github.com/angular/angular/issues/15088

    return new Promise(resolve => {

      zip(
        // this.httpClient.get(`assets/tmp/i18n/${this.i18n.defaultLang}.json`),
        this.httpClient.get('assets/tmp/app-data.json'),
      )
        .pipe(
          // 接收其他拦截器后产生的异常消息
          catchError(([langData, appData]) => {
            resolve(null)
            return [langData, appData];
          }),
        )
        .subscribe(
          ([appData]) => {
            // setting language data
            // this.translate.setTranslation(this.i18n.defaultLang, langData);
            // this.translate.setDefaultLang(this.i18n.defaultLang);

            // application data

            const res: any = appData;

            // 应用信息：包括站点名、描述、年份
            this.settingService.setApp(res.app);
            // 用户信息：包括姓名、头像、邮箱地址
            // let userInfo = localStorage.getItem('userInfo');
            // if (userInfo) {
            // } else {
            //   this.settingService.setUser(res.user);
            // }
            // 菜单
            // let menuList = localStorage.getItem('menuList');
            // console.log(menuList);

            // if (menuList) {
            //   this.menuService.add(JSON.parse(menuList));
            // } else {
            //   this.menuService.add(res.menu);
            // }

            // this.menuService.add(res.menu);
            // 设置页面标题的后缀
            this.titleService.default = '';
            this.titleService.suffix = res.app.name;
          },
          () => { },
          () => {
            resolve(null)
          },
        );
    });
  }
  menuList: any[] = [
    '/passport/login',
    '/myorder',
    '/complain',
    // '/view/operate',
    // '/view/classify',
    '/scene',
    '/device/type',
    '/device/factory',
    '/device/malfunction',
    "/project",
    // "/salesman/self",
    // "/salesman/oem",
  ]

  getUserMsg() {
    return new Promise((rsl, rej) => {
      this._http.get("/api/user/owner").subscribe((res: any) => {
        if (res.success) {
          let powerList = [
            '/order', '/view/operate',
            '/view/classify',
            '/view/speed',
            "/salesman/self",
            "/salesman/oem",
          ];
          let purchaseList = ['/component']
          if (res.data.is_admin) {
            this.menuList = [...this.menuList, ...powerList]
          }
          if (res.data.deal_notify) {
            this.menuList = [...this.menuList, ...purchaseList]
          }

          this.settingService.setUser(res.data);

          localStorage.setItem('menuList', JSON.stringify(this.menuList));
          this.settingService.setUser(res.data);
          rsl(null)
        }
      })
    })

  }





}
