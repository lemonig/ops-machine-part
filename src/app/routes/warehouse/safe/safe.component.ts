import { Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { ExcelService } from '@core/excel/excel.service';

@Component({
  selector: 'app-safe',
  templateUrl: './safe.component.html',
  styleUrls: ['./safe.component.less']
})
export class SafeComponent implements OnInit {

  tableData: any[] = [];
  additionalData: any
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
    public ExcelService: ExcelService,
  ) { }

  ngOnInit() {
    this.getTableData();
  }
  safeStatus: any
  proname: any

  getTableData() {
    let params = {
      page: this.q.pageIndex,
      size: this.q.pageSize,
      data: {
        safeStatus: this.safeStatus,
        name: this.proname
      }
    }
    this.loading = true;
    this._http.post('/api/accessory/safe/page', params).subscribe((res: any) => {
      this.loading = false;
      if (res.success) {
        this.tableData = res.data;
        //分页
        this.additionalData = res.additional_data
        this.q.total = res.additional_data.pagination.total;
      } else {
        this.msg.error(res.message);
      }
    })
  }
  search() {
    //初始化分页
    this.q = {
      pageIndex: 1,
      pageSize: 10,
      total: 0,
    };
    this.getTableData();
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

  // 下载
  download() {
    this.ExcelService.download('/api/accessory/safe/export', { name: this.proname }, '安全配件')
  }

  showOperatePage: boolean = false;
  operateId: any = null;
  operateForm: FormGroup;
  add() {
    this.operateId = null;

    this.operateForm = this.fb.group({
      name: [null,],
    })
    this.showOperatePage = true;

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
