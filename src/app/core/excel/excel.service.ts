import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable, Injector, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { NzMessageService } from 'ng-zorro-antd';
import moment from 'moment';
import { Router } from '@angular/router';

import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';

@Injectable()
export class ExcelService {

    constructor(private http: HttpClient,
        private msg: NzMessageService,
        private injector: Injector,
        @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService) { }

    public download(webApi: string, params: any, filename: string) {
        filename = filename + '_' + this.formatDate() + '.xls';
        return this.downloadExcel_Post(webApi, params, filename);
    }
    public download_doc(webApi: string, params: any, filename: string) {
        filename = filename + '_' + this.formatDate() + '.doc';
        return this.downloadExcel_Post(webApi, params, filename);
    }


    private formatDate() {
        return moment().format('YYYY_MM_DD')
    }

    private downloadExcel_Post(webApi: string, params: any, filename: string) {
        return new Promise((resove, reject) => {
            let myHeaders = new HttpHeaders();
            myHeaders = this.setToken(myHeaders);
            myHeaders.append('Content-Type', 'application/json');
            myHeaders.append('Accept', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

            this.http.request("POST", webApi,
                { body: params, headers: myHeaders, responseType: 'arraybuffer' }
            ).subscribe((res: any) => {
                var blob = new Blob([res], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
                var objectUrl = URL.createObjectURL(blob);
                var a = document.createElement('a');
                document.body.appendChild(a);
                a.setAttribute('style', 'display:none');
                a.setAttribute('href', objectUrl);
                a.setAttribute('download', filename);
                a.click();
                URL.revokeObjectURL(objectUrl);
                resove(1);
            },
                (error: any) => {
                    this.msg.error(error.message || '下载失败');
                    reject();
                });
        })
    }

    // private downloadCSV_Post(webApi: string, params: any, filename: string) {
    //     let myHeaders = new HttpHeaders();
    //     myHeaders = this.setToken(myHeaders);
    //     myHeaders.append('Content-Type', 'application/json');
    //     myHeaders.append('Accept', 'text/csv');

    //     this.http.request("POST", webApi,
    //         { body: params, headers: myHeaders, responseType: 'arraybuffer' }
    //     ).subscribe((res: any) => {
    //         var blob = new Blob([res], { type: "text/csv" });
    //         var objectUrl = URL.createObjectURL(blob);
    //         var a = document.createElement('a');
    //         document.body.appendChild(a);
    //         a.setAttribute('style', 'display:none');
    //         a.setAttribute('href', objectUrl);
    //         a.setAttribute('download', filename);
    //         a.click();
    //         URL.revokeObjectURL(objectUrl);
    //     },
    //         (error: any) => {
    //             this.msg.error(error.message || '下载失败');
    //         });
    // }


    private setToken(header: any) {
        const authData = this.tokenService.get();
        if (!authData && !authData.token) {
            // this.goLogin();
            this.goLogin()
            return Observable.create(observer => observer.error({ status: 401 }));
        }
        header.set('token', `${authData.token}`);
        return header;
    }

    private goLogin() {
        this.injector.get(Router).navigate(['/passport/login']);
    }
}
