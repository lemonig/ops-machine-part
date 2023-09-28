import { Component, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { SettingsService } from '@delon/theme';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { _HttpClient } from '@delon/theme';
import { NzMessageService, NzModalService, UploadXHRArgs } from 'ng-zorro-antd';

@Component({
  selector: 'header-user',
  templateUrl: './user.component.html',
})
export class HeaderUserComponent {
  constructor(
    public _http: _HttpClient,
    public msg: NzMessageService,
    public fb: FormBuilder,
    public settings: SettingsService,
    private router: Router,
    @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService,
  ) { }
  userMsg: any = {
    avatar: '',

  }
  ngOnInit() {

  }

  menuList: any[] = [
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



  logout() {
    this._http.post('/api/logout').subscribe(res => {
      this.tokenService.clear();
      localStorage.clear();
      this.msg.success('退出成功')
      location.href = window.location.origin
    })


  }



  showModifyPwd: boolean = false;
  ModifyPwdForm: FormGroup;
  okLoading: boolean = false;

  modifyPwd() {
    this.ModifyPwdForm = this.fb.group({
      oldPwd: [null, Validators.required],
      newPwd: [null, Validators.required],
      repeatNewPwd: [null, [Validators.required]],
    })
    this.showModifyPwd = true;
  }
  submitModifyPwd() {
    for (const i in this.ModifyPwdForm.controls) {
      this.ModifyPwdForm.controls[i].markAsDirty();
      this.ModifyPwdForm.controls[i].updateValueAndValidity();
    }
    if (this.ModifyPwdForm.invalid) {
      return
    }
    if (this.ModifyPwdForm.value.newPwd !== this.ModifyPwdForm.value.repeatNewPwd) {
      this.msg.error('两次密码输入不一致');
      return
    }
    this.okLoading = true;
    let params = {
      old_password: this.ModifyPwdForm.value.oldPwd,
      new_password1: this.ModifyPwdForm.value.newPwd,
      new_password2: this.ModifyPwdForm.value.repeatNewPwd
    }
    this._http.post('api/user/updatepwd', params).subscribe((res: any) => {
      this.okLoading = false;
      if (res.success) {
        this.msg.success('修改成功!');
        this.showModifyPwd = false;
      } else {
        this.msg.error(res.message);
      }
    }, (res: any) => {
      this.okLoading = false;
      this.msg.error(res.error.message);
    })
  }
  showModifyInfo: boolean = false;
  infoForm: FormGroup;
  infoDetail: any = {};
  validMobile() {
    return (control: any) => {
      if (control.value) {
        let ok = String(control.value).length == 11;
        return ok ? null : { 'mobileFormat': { value: control.value } };
      } else {
        return null;
      }
    }
  }
  modifyInfo() {
    this._http.post('api/user/${id}').subscribe((res: any) => {
      if (res.success) {
        this.infoDetail = res.data;
        this.infoForm = this.fb.group({
          nickname: [res.data.nickname, [Validators.required, Validators.maxLength(20)]],
          mobile: [res.data.mobile, this.validMobile()],
        })
        this.showModifyInfo = true;
      } else {
        this.msg.error(res.message);
      }
    }, (res: any) => {
      this.msg.error(res.error.message);
    })
  }
  submitModifyInfo() {
    for (const i in this.infoForm.controls) {
      this.infoForm.controls[i].markAsDirty();
      this.infoForm.controls[i].updateValueAndValidity();
    }
    if (this.infoForm.invalid) {
      return
    }
    this.okLoading = true;
    this._http.post(`api/user/profile/save`, this.infoForm.value).subscribe((res: any) => {
      this.okLoading = false;
      if (res.success) {
        this.msg.success('保存成功!');
        this.showModifyInfo = false;
      } else {
        this.msg.error(res.message);
      }
    }, (res: any) => {
      this.okLoading = false;
      this.msg.error(res.error.message);
    })
  }
}
