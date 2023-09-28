import { Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { ExcelService } from '@core/excel/excel.service';

@Component({
  selector: 'app-ledger',
  templateUrl: './ledger.component.html',
  styleUrls: ['./ledger.component.less']
})
export class LedgerComponent implements OnInit {

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
    this.getTypeList()

  }
  proname: string
  getTableData() {
    let params = {
      page: this.q.pageIndex,
      size: this.q.pageSize,
      data: {
        name: this.proname,
        accessoryCategoryIdList: this.listOfSearch,
        isSafetyAccessoryList: this.listOfSearch1,
      }
    }
    this.loading = true;
    this._http.post('/api/accessory/ledger/page', params).subscribe((res: any) => {
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
  //分页
  pageIndexChange($event: any) {
    this.q.pageIndex = $event;
    this.getTableData();
  }
  pageSizeChange($event: any) {
    this.q.pageSize = $event;
    this.getTableData();
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

  showOperatePage: boolean = false;
  operateId: any = null;
  operateForm: FormGroup;
  add() {
    this.btnLoading = true
    this.loading = true;
    this._http.post('/api/accessory/sync', {}).subscribe((res: any) => {
      this.loading = false;
      this.btnLoading = false;
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
  SwitchSafe({ id, isSafetyAccessory }) {
    this._http.post(`/api/accessory/update`, { isSafetyAccessory: !isSafetyAccessory, id }).subscribe((res: any) => {
      if (res.success) {
        this.getTableData();
      } else {
        this.msg.error(res.message);
      }
    })
  }
  // 下载
  download() {
    this.ExcelService.download('/api/accessory/ledger/export', { name: this.proname }, '配件台账')
  }

  listOfFilter = [];
  listOfFilter1 = [{ text: '是', value: true }, { text: '否', value: false }];
  listOfSearch: string[] = [];
  listOfSearch1: string[] = [];
  filterChange(value: string[]): void {
    this.listOfSearch = value;
    this.search();
  }
  filterChange1(value: string[]): void {
    this.listOfSearch1 = value;
    this.search();
  }




  typeList: any
  getTypeList() {
    let params = {
      page: 1,
      size: 2000,
    }
    this.loading = true;
    this._http.post('/api/accessoryCategory/page', params).subscribe((res: any) => {
      this.loading = false;
      if (res.success) {
        this.typeList = res.data;
        this.listOfFilter = res.data.map(item => ({ text: item.name, value: item.id }))
      } else {
        this.msg.error(res.message);
      }
    })
  }
  detailData: any
  modify(data: any) {
    this.operateId = data.id;
    this.detailData = data
    this.operateForm = this.fb.group({
      unitPrice: [data.unitPrice, [Validators.maxLength(20)]],
      note: [data.note, [Validators.maxLength(20)]],
      accessoryCategoryId: [data.accessoryCategoryId, [Validators.maxLength(20)]],
      isSafetyAccessory: [data.isSafetyAccessory, [Validators.maxLength(20)]],
      safetyThreshold: [data.safetyThreshold, [Validators.maxLength(20)]],
      warningThreshold: [data.warningThreshold, [Validators.maxLength(20)]],

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

    if (this.operateId) {
      params.id = this.operateId;
      this.modifyData(params);
    } else {
      this.addData(params)
    }
  }
  addData(params: any) {
    this.btnLoading = true;
    this._http.post(`api/company/add`, params).subscribe((res: any) => {
      this.btnLoading = false;
      if (res.success) {
        this.getTableData();
        this.showOperatePage = false;
      } else {
        this.msg.error(res.message);
      }
    })
  }
  modifyData(params: any) {
    this.btnLoading = true;
    this._http.post(`/api/accessory/update`, params).subscribe((res: any) => {
      this.btnLoading = false;
      if (res.success) {
        this.getTableData();
        this.showOperatePage = false;
      } else {
        this.msg.error(res.message);
      }
    })
  }



}
