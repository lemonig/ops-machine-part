/*
 * @Author: Jonny
 * @Date: 2023-09-05 10:22:34
 * @LastEditors: Jonny
 * @LastEditTime: 2023-09-05 15:01:04
 * @FilePath: \ops-machine-part\src\app\core\net\default.interceptor.ts
 */
import { Injectable, Injector, Inject } from '@angular/core';
import { Router } from '@angular/router';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpErrorResponse,
  HttpEvent,
  HttpResponseBase,
  HttpHeaders,
  HttpResponse,
} from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { mergeMap, catchError } from 'rxjs/operators';
import { _HttpClient } from '@delon/theme';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';
import { NzMessageService } from 'ng-zorro-antd';

/**
 * 默认HTTP拦截器，其注册细节见 `app.module.ts`
 */
@Injectable()
export class DefaultInterceptor implements HttpInterceptor {
  constructor(
    private injector: Injector,
    @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService,
    public msg: NzMessageService,
  ) { }

  private goTo(url: string) {
    setTimeout(() => this.injector.get(Router).navigateByUrl(url));
  }

  private handleData(ev: HttpResponseBase): Observable<any> {
    switch (ev.status) {
      case 401:
        (this.injector.get(DA_SERVICE_TOKEN) as ITokenService).clear();
        this.goTo('/passport/login');
        break;
      case 403:
      case 404:
      case 500:
        break;
      case 504:
        this.msg.error('网关错误');
        break
      default:
        break;
    }
    return throwError(ev);
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // 统一加上服务端前缀
    let url = req.url;
    let header: HttpHeaders = null;
    let no_auth_url = (req.url === 'api/login' || req.url === 'api/register' || req.url.includes('assets/'));
    if (!no_auth_url) {
      const authData = this.tokenService.get();
      if (!authData || (authData && !authData.token)) {
        //token没有
        this.goTo('/passport/login');
        return of();
      }
      header = req.headers.set('token', `${authData.token}`);
    }
    const newReq = req.clone({
      headers: header,
      url: url,
    });
    return next.handle(newReq).pipe(
      mergeMap((event: any) => {
        // 允许统一对请求错误处理
        if (event instanceof HttpResponse && event.body.error === 'UNAUTHENTICATED') {
          this.goTo('/passport/login');
        }
        // 若一切都正常，则后续操作
        return of(event);
      }),
      catchError((err: HttpErrorResponse) => this.handleData(err)),
    );
  }
}
