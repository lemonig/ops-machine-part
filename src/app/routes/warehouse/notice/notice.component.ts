import { Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';

@Component({
  selector: 'app-notice',
  templateUrl: './notice.component.html',
  styleUrls: ['./notice.component.less']
})
export class NoticeComponent implements OnInit {
  tableData: any[] = [];
  loading: boolean = false;
  btnLoading: boolean = false;
  q: any = {
    pageIndex: 1,
    pageSize: 10,
    total: 1,
  }
  constructor(
    public fb: FormBuilder,
    public _http: _HttpClient,
    public msg: NzMessageService,
    public modal: NzModalService,
  ) { }

  ngOnInit() {
    this.getTableData();
  }
  getTableData() {
    let params = {
      page: this.q.pageIndex,
      size: this.q.pageSize,
    }
    this.loading = true;
    this._http.post('/api/notification/reminder/page', params).subscribe((res: any) => {
      this.loading = false;
      if (res.success) {
        this.tableData = res.data;
        //分页
        this.q.total = res.additional_data.pagination.total;
      } else {
        this.msg.error(res.message);
      }
    })
  }
  //分页
  pageIndexChange($event: any) {
    this.q.pageIndex = $event;
    this.getTableData();
  }
  pageSizeChange($event: any) {
    this.q.pageSize = $event;
    this.getTableData();
  }


  showOperatePage: boolean = false;
  operateId: any = null;
  operateForm: FormGroup;
  add() {
    this.operateId = null;
    this._http.post(`/api/notification/recipient/setting`, {}).subscribe((res: any) => {
      this.btnLoading = false;
      if (res.success) {
        this.operateForm = this.fb.group({
          name: [res.data,],
        })
        this.showOperatePage = true;

      } else {
        this.msg.error(res.message);
      }
    })

  }

  saveOperateData() {
    for (const i in this.operateForm.controls) {
      this.operateForm.controls[i].markAsDirty();
      this.operateForm.controls[i].updateValueAndValidity();
    }
    if (this.operateForm.invalid) {
      return
    }
    let params: any = {};
    let data = JSON.parse(JSON.stringify(this.operateForm.value));
    params = data;
    this.addData(params)
  }
  addData(params: any) {
    this.btnLoading = true;
    this._http.post(`/api/notification/recipient/setting`, params).subscribe((res: any) => {
      this.btnLoading = false;
      if (res.success) {
        this.getTableData();
        this.showOperatePage = false;
      } else {
        this.msg.error(res.message);
      }
    })
  }

  delete(id: any) {
    this.modal.confirm({
      nzContent: '确定删除此条数据？',
      nzOkText: '确认',
      nzCancelText: '取消',
      nzTitle: '删除',
      nzOnOk: () => {
        this._http.post(`/api/accessoryCategory/delete`, { id }).subscribe((res: any) => {
          this.btnLoading = false;
          if (res.success) {
            this.getTableData();
            this.showOperatePage = false;
          } else {
            this.msg.error(res.message);
          }
        })
      },
      nzOnCancel: () => { }
    })

  }


}
