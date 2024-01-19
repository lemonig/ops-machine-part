import { Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { FormGroup, FormBuilder, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { BehaviorSubject, Observable } from 'rxjs';
import { debounceTime, map, switchMap } from 'rxjs/operators';
import { ExcelService } from '@core/excel/excel.service';
import { Subject, Subscription } from 'rxjs';


@Component({
  selector: 'app-device',
  templateUrl: './device.component.html',
  styleUrls: ['./device.component.less']
})
export class DeviceComponent implements OnInit {

  private searchSubject = new Subject<string>();
  private valueChangesSubscription: Subscription;
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
  ) {


    this.searchSubject.pipe(
      debounceTime(300)
    ).subscribe(() => {
      this.getGoods();
    });


  }
  inventoryName: any
  onInputChange(value: string): void {
    let res = this.goodList.find(item => item.inventoryCode === value)
    if (res) {
      this.inventoryName = res.inventoryName
    }
  }
  randomUserUrl = 'api/user/list/all';
  ngOnInit() {
    this.getTableData();

  }
  keyword: string = ''
  getTableData() {
    let params = {
      page: this.q.pageIndex,
      size: this.q.pageSize,
      data: {

        classification: 2,
        name: this.keyword
      }
    }
    this.loading = true;
    this._http.post('/api/accessory/ledger/page', params).subscribe((res: any) => {
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
  search() {
    //初始化分页
    this.q = {
      pageIndex: 1,
      pageSize: 10,
      total: 0,
    };
    this.getTableData();
  }

  tableData1: any[] = [];
  q1: any = {
    pageIndex: 1,
    pageSize: 10,
    total: 1,
  }
  showDetailPage: boolean = false;
  showOperatePage: boolean = false;
  operateId: any = null;
  inventoryCode: string = ''
  getTableData1(parentAccessoryId) {
    this.operateId = parentAccessoryId
    let params = {
      page: this.q1.pageIndex,
      size: this.q1.pageSize,
      data: {
        parentAccessoryId
      }
    }
    this.loading = true;
    this._http.post('/api/accessory/instrument/page', params).subscribe((res: any) => {
      this.loading = false;
      if (res.success) {
        this.tableData1 = res.data;
        //分页
        this.q1.total = res.additional_data.pagination.total;
        this.showDetailPage = true
      } else {
        this.msg.error(res.message);
      }
    })
  }
  //分页
  pageIndexChange1($event: any) {
    this.q.pageIndex = $event;
    this.getTableData();
  }
  pageSizeChange1($event: any) {
    this.q.pageSize = $event;
    this.getTableData();
  }
  search1() {
    //初始化分页
    this.q1 = {
      pageIndex: 1,
      pageSize: 10,
      total: 0,
    };
    this.getTableData1(this.operateId);
  }

  options: any[] = [];
  goodList: any[] = []
  getGoods() {
    return new Promise((rso, rej) => {
      this._http.post(`/api/accessory/simple/search`, {
        name: this.inventoryCode || '',
      }).subscribe((res: any) => {
        if (res.success) {
          rso(res.data)
          this.goodList = res.data
        } else {
          this.msg.error(res.message);
        }
      })
    })

  }
  onInput(e: Event): void {
    const value = (e.target as HTMLInputElement).value;
    this.inventoryCode = value
    if (!value) {
      this.options = [];
    } else {
      this.searchSubject.next();
      // this.options = this.goodList.filter(item => item.);
    }
  }




  forbiddenNameValidator(nameRe: RegExp): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const forbidden = nameRe.test(control.value);

      return forbidden ? null : { forbiddePsw: { value: control.value } };
      // return forbidden ? null : { message: 'xxxxxxxx' };
    };
  }







  operateForm2: FormGroup
  showOperatePage2: boolean = false
  operateId2: any = null
  add2() {

    this.operateForm2 = this.fb.group({
      inventoryCode: [null, Validators.required],
    })
    this.operateId2 = null;
    this.showOperatePage2 = true;
  }
  modify2(data: any) {
    this.operateForm2 = this.fb.group({
      inventoryCode: [data.inventoryCode, Validators.required],
    })
    this.inventoryName = data.inventoryName
    this.operateId2 = data.id;
    this.showOperatePage2 = true;

  }


  saveOperateData2() {
    for (const i in this.operateForm2.controls) {
      this.operateForm2.controls[i].markAsDirty();
      this.operateForm2.controls[i].updateValueAndValidity();
    }
    if (this.operateForm2.invalid) {
      return
    }
    let params = JSON.parse(JSON.stringify(this.operateForm2.value));

    params.parentAccessoryId = this.operateId
    if (this.operateId2) {
      params.id = this.operateId2;
      this.modifyData2(params);
    } else {
      this.addData2(params)
    }
  }
  addData2(params: any) {
    this.btnLoading = true;
    this._http.post(`/api/accessory/instrument/add`, params).subscribe((res: any) => {
      this.btnLoading = false;
      if (res.success) {
        this.getTableData1(this.operateId);
        this.closeOperatePage2();
      } else {
        this.msg.error(res.message);
      }
    })
  }
  modifyData2(params: any) {
    this.btnLoading = true;
    this._http.post(`/api/accessory/instrument/update`, params).subscribe((res: any) => {
      this.btnLoading = false;
      if (res.success) {
        this.getTableData1(this.operateId);
        this.msg.success(res.message);
        this.closeOperatePage2();
      } else {
        this.msg.error(res.message);
      }
    })
  }

  closeOperatePage2() {
    this.showOperatePage2 = false;
    this.operateForm2.reset()
    this.inventoryName = ''
    this.inventoryCode = ''
    this.goodList = []
  }



  delete2(id: any) {
    this.modal.confirm({
      nzContent: '删除后将无法恢复',
      nzOkText: '确认',
      nzCancelText: '取消',
      nzTitle: '确定删除',
      nzOnOk: () => {
        this._http.post(`/api/accessory/instrument/delete`, { id }).subscribe((res: any) => {
          if (res.success) {
            this.msg.success('删除成功');
            this.getTableData1(this.operateId);
          } else {
            this.msg.error(res.message);
          }
        })
      },
      nzOnCancel: () => { }
    })

  }





}
