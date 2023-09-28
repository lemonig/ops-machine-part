import { Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import moment from 'moment';
import { txtStatus } from '../../../../utils/public';
import { ExcelService } from '@core/excel/excel.service';

@Component({
  selector: 'app-shipments',
  templateUrl: './shipments.component.html',
  styleUrls: ['./shipments.component.less']
})
export class ShipmentsComponent implements OnInit {
  data = [
    {
      title: 'Ant Design Title 1'
    },
    {
      title: 'Ant Design Title 2'
    },
    {
      title: 'Ant Design Title 3'
    },
    {
      title: 'Ant Design Title 4'
    }
  ];
  tableData: any[] = [];
  loading: boolean = false;
  btnLoading: boolean = false;
  q: any = {
    pageIndex: 1,
    pageSize: 10,
    total: 1,
  }
  endDate0: any = new Date();
  startDate0: any = new Date(new Date().getTime() - 30 * 24 * 3600 * 1000);
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
  initPage() { //修改完页面状态初始化
    this.showDetailPage = false
    this.getTableData()
  }
  searchName: string
  getTableData() {
    if (this.validateQuery(this.startDate0, this.endDate0)) {
      let params = {
        page: this.q.pageIndex,
        size: this.q.pageSize,
        data: {
          beginTime: moment(this.startDate0).format('YYYYMMDD'),
          endTime: moment(this.endDate0).format('YYYYMMDD'),
          name: this.searchName
        }
      }

      this.loading = true;
      this._http.post('/api/delivery/page', params).subscribe((res: any) => {
        this.loading = false;
        if (res.success) {

          this.tableData = res.data;
          //分页
          this.q.total = res.additional_data.total;
        } else {
          this.msg.error(res.message);
        }
      })
    }

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

  // 发货
  projectName: string = '';
  urgencyLevel: string = ''
  invontoryVis: boolean = false
  isAllDisplayDataChecked = false;
  isOperating = false;
  isIndeterminate = false;
  listOfDisplayData: any[] = [];
  listOfAllData: any[] = [];
  mapOfCheckedId: { [key: string]: boolean } = {};
  numberOfChecked = 0;
  q1: any = {
    pageIndex: 1,
    pageSize: 10,
    total: 1,
  }
  deliverGoods() {
    this.invontoryVis = true

    this.search1();


  }
  //分页
  pageIndexChange1($event: any) {
    this.q1.pageIndex = $event;
    this.getdeliverGoods();
  }
  pageSizeChange1($event: any) {
    this.q1.pageSize = $event;
    this.getdeliverGoods();
  }
  search1() {
    //初始化分页
    this.q1 = {
      pageIndex: 1,
      pageSize: 10,
      total: 0,
    };
    this.getdeliverGoods();
  }
  getdeliverGoods() {
    let params = {
      page: this.q1.pageIndex,
      size: this.q1.pageSize,
      data: {

        name: this.projectName,
        urgencyLevel: this.urgencyLevel
      }
    }

    this.loading = true;
    this._http.post('/api/requisition/delivery/page', params).subscribe((res: any) => {
      this.loading = false;
      if (res.success) {

        this.listOfAllData = res.data;
        //分页
        this.q.total = res.additional_data.total;
      } else {
        this.msg.error(res.message);
      }
    })

  }


  currentPageDataChange($event: any[]): void {
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
    this.numberOfChecked = this.listOfAllData.filter(item => this.mapOfCheckedId[item.id]).length;
  }

  checkAll(value: boolean): void {
    this.listOfDisplayData.filter(item => !item.disabled).forEach(item => (this.mapOfCheckedId[item.id] = value));
    this.refreshStatus();
  }

  operateData(): void {
    this.isOperating = true;
    setTimeout(() => {
      this.listOfAllData.forEach(item => (this.mapOfCheckedId[item.id] = false));
      this.refreshStatus();
      this.isOperating = false;
    }, 1000);
  }
  handleInvontoryCancel(): void {
    this.invontoryVis = false;
    this.operateId = null
  }
  handleInvontoryOk(): void {
    let params = {
      requisitionIdList: Reflect.ownKeys(this.mapOfCheckedId)
    }
    this.btnLoading = true;
    this._http.post(`/api/delivery/add`, params).subscribe((res: any) => {
      this.btnLoading = false;
      if (res.success) {
        this.getTableData();
        this.msg.success(res.message);
        this.invontoryVis = false
        this.operateId = null
      } else {
        this.msg.error(res.message);
      }
    })
  }



  handleStatusChange($event) {
    this.search()
  }



  showDetailPage: boolean = false;
  operateId: any = null;
  operateForm: FormGroup;
  add() {
    this.operateId = null;

    this.showDetailPage = true;

  }



  detailData: any = {};
  detail(id: any) {
    this.operateId = id
    this._http.post(`/api/delivery/get`, { id }).subscribe((res: any) => {
      if (res.success) {
        this.detailData = res.data;
        this.showDetailPage = true;

      } else {
        this.msg.error(res.message);
      }
    })
  }

  // 填充物流订单号
  showOperatePage: boolean = false
  orderForm: FormGroup

  saveOperateData() {
    for (const i in this.orderForm.controls) {
      this.orderForm.controls[i].markAsDirty();
      this.orderForm.controls[i].updateValueAndValidity();
    }
    if (this.orderForm.invalid) {
      return
    }
    let params = this.orderForm.value


    this._http.post(`/api/delivery/fillTrackingNumber`, { id: this.operateId, ...params }).subscribe((res: any) => {
      if (res.success) {
        this.msg.success(res.message);
        this.showOperatePage = false
        this.detail(this.operateId)
      } else {
        this.msg.error(res.message);
      }
    })
  }

  edit() {
    this.showOperatePage = true
    this.orderForm = this.fb.group({
      trackingNumber: [null, [Validators.required,]],
    })

  }
  confirm() {
    this._http.post(`/api/delivery/confirm`, { id: this.operateId, }).subscribe((res: any) => {
      if (res.success) {
        this.msg.success(res.message);
        this.detail(this.operateId)
      } else {
        this.msg.error(res.message);
      }
    })
  }
  cancel() {
    this._http.post(`/api/delivery/cancel`, { id: this.operateId, }).subscribe((res: any) => {
      if (res.success) {
        this.msg.success(res.message);
        this.detail(this.operateId)
      } else {
        this.msg.error(res.message);
      }
    })
  }
  reCreate() {
    this._http.post(`/api/delivery/re-generate`, { id: this.operateId, }).subscribe((res: any) => {
      if (res.success) {
        this.msg.success(res.message);
        this.detail(this.operateId)
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
        this._http.post(`/api/delivery/outing/delete`, { id }).subscribe((res: any) => {
          this.btnLoading = false;
          if (res.success) {
            this.detail(this.operateId);
            this.msg.success(res.message);
          } else {
            this.msg.error(res.message);
          }
        })
      },
      nzOnCancel: () => { }
    })

  }


  export() {
    let params: any = {
      id: this.operateId,
    };

    this.ExcelService.download('/api/delivery/outing/export', params, '发货记录')
  }
  // 出库表单
  showOperatePage1: boolean = false
  orderForm1: FormGroup
  wareHouseOperateId: any
  modify(data) {

    this.wareHouseOperateId = data.id
    this.showOperatePage1 = true
    this.orderForm1 = this.fb.group({
      outgoingQuantity: [data.outgoingQuantity, [Validators.required,]],
    })
  }

  saveOperateData1() {
    for (const i in this.orderForm1.controls) {
      this.orderForm1.controls[i].markAsDirty();
      this.orderForm1.controls[i].updateValueAndValidity();
    }
    if (this.orderForm1.invalid) {
      return
    }
    let params = this.orderForm1.value


    this._http.post(`/api/delivery/outing/update`, { id: this.wareHouseOperateId, ...params }).subscribe((res: any) => {
      if (res.success) {
        this.msg.success(res.message);
        this.showOperatePage1 = false
        this.detail(this.operateId)
      } else {
        this.msg.error(res.message);
      }
    })
  }

  validateQuery(start: any, end: any) {

    //验证时间
    if (!start || !end) {
      this.msg.info('开始日期或结束日期不能为空');
      return false;
    }
    let ltTime = new Date(moment(start).format('YYYY-MM-DD')).getTime();
    let gtTime = new Date(moment(end).format('YYYY-MM-DD')).getTime();
    if (ltTime > gtTime) {
      this.msg.info('开始日期不能大于结束日期');
      return false;
    }
    return true;
  }
  queryDisabledDate = (current: Date): boolean => {
    return current.getTime() > new Date(moment().format('YYYY-MM-DD')).getTime();
  };



}
