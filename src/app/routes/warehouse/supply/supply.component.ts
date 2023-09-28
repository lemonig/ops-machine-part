import { Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { ExcelService } from '@core/excel/excel.service';


@Component({
  selector: 'app-supply',
  templateUrl: './supply.component.html',
  styleUrls: ['./supply.component.less']
})
export class SupplyComponent implements OnInit {

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
    public ExcelService: ExcelService,
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
    this._http.post('/api/restockingPlan/page', params).subscribe((res: any) => {
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
  // 下载
  download({ id }) {
    this.ExcelService.download('/api/accessory/safe/export', { id }, '配件补仓')
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
    this.getTableData1()

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
        this._http.post(`/api/restockingPlan/delete`, { id }).subscribe((res: any) => {
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

  // 补仓

  tableData1: any[] = [];

  q1: any = {
    pageIndex: 1,
    pageSize: 10,
    total: 1,
  }

  getTableData1() {
    let params = {
      page: this.q1.pageIndex,
      size: this.q1.pageSize,
    }
    this.loading = true;
    this._http.post('/api/accessory/safe/page', params).subscribe((res: any) => {
      this.loading = false;
      if (res.success) {
        this.tableData1 = res.data;
        //分页
        this.q1.total = res.additional_data.pagination.total;
      } else {
        this.msg.error(res.message);
      }
    })
  }
  //分页
  pageIndexChange1($event: any) {
    this.q1.pageIndex = $event;
    this.getTableData1();
  }
  pageSizeChange1($event: any) {
    this.q1.pageSize = $event;
    this.getTableData1();
  }

  isAllDisplayDataChecked = false;
  isOperating = false;
  isIndeterminate = false;
  listOfDisplayData: any[] = [];
  mapOfCheckedId: { [key: string]: boolean } = {};
  numberOfChecked = 0;

  currentPageDataChange($event: any[]): void {
    console.log($event);

    this.listOfDisplayData = $event;
    this.refreshStatus();
  }

  refreshStatus(): void {
    this.isAllDisplayDataChecked = this.listOfDisplayData
      .filter(item => !item.disabled)
      .every(item => this.mapOfCheckedId[item.id]);
    this.isIndeterminate =
      this.listOfDisplayData.filter(item => !item.disabled).some(item => this.mapOfCheckedId[item.id]) &&
      !this.isAllDisplayDataChecked;
    this.numberOfChecked = this.tableData1.filter(item => this.mapOfCheckedId[item.id]).length;
  }

  checkAll(value: boolean): void {
    this.listOfDisplayData.filter(item => !item.disabled).forEach(item => (this.mapOfCheckedId[item.id] = value));
    this.refreshStatus();
  }

  operateData(): void {
    this.isOperating = true;
    setTimeout(() => {
      this.tableData1.forEach(item => (this.mapOfCheckedId[item.id] = false));
      this.refreshStatus();
      this.isOperating = false;
    }, 1000);
  }



  add1(): void {
    let res = this.tableData1.filter(ele => Reflect.has(this.mapOfCheckedId, ele.id))
    this.btnLoading = true;
    this._http.post(`/api/restockingPlan/add`, { detail: res }).subscribe((res: any) => {
      this.btnLoading = false;
      if (res.success) {
        this.getTableData();
        this.showOperatePage = false;
        this.operateData()
        this.msg.success(res.message);
      } else {
        this.msg.error(res.message);
      }
    })
  }
}
