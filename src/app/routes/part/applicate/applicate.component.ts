import { Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import moment from 'moment';
import { txtStatus } from '../../../../utils/public';
import { UploadFile } from 'ng-zorro-antd/upload';
import { Observable, Observer } from 'rxjs';
import { ExcelService } from '@core/excel/excel.service';

@Component({
  selector: 'app-applicate',
  templateUrl: './applicate.component.html',
  styleUrls: ['./applicate.component.less']
})
export class ApplicateComponent implements OnInit {

  tableData: any[] = [];
  loading: boolean = false;
  btnLoading: boolean = false;
  isSpinning = false;
  q: any = {
    pageIndex: 1,
    pageSize: 10,
    total: 1,
  }
  projectName: any;
  endTime: any = new Date();
  beginTime: any = new Date(new Date().getTime() - 30 * 24 * 3600 * 1000);
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
  ngOnDestroy() {

  }





  shippingStatus: any = ""
  registrationStatus: any = ""



  getTableData() {
    // 初始化id
    if (this.validateQuery(this.beginTime, this.endTime)) {
      let params = {
        page: this.q.pageIndex,
        size: this.q.pageSize,
        data: {
          name: this.projectName ? this.projectName : '',
          beginTime: moment(this.beginTime).format('YYYYMMDD'),
          endTime: moment(this.endTime).format('YYYYMMDD'),
          shippingStatus: !!this.shippingStatus ? this.shippingStatus : undefined,
          registrationStatus: !!this.registrationStatus ? this.registrationStatus : undefined,
        }

      }
      this.loading = true;
      this._http.post('/api/requisition/page', params).subscribe((res: any) => {
        this.loading = false;
        if (res.success) {
          this.tableData = res.data;
          if (res.related_objects) {
          }
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
  // 下载
  download() {
    let params = {
      page: this.q.pageIndex,
      size: this.q.pageSize,
      data: {
        name: this.projectName ? this.projectName : '',
        beginTime: moment(this.beginTime).format('YYYYMMDD'),
        endTime: moment(this.endTime).format('YYYYMMDD'),
        shippingStatus: !!this.shippingStatus ? this.shippingStatus : undefined,
        registrationStatus: !!this.registrationStatus ? this.registrationStatus : undefined,
      }

    }

    this.ExcelService.download('/api/requisition/export', params, '配件申请')
  }



  // 详情
  //取消申请
  showOperatePage1: boolean = false
  operateForm1: FormGroup = this.fb.group({
    cancelRemark: [null, [Validators.maxLength(300)]],
  })

  concel() {
    this.showOperatePage1 = true
  }

  handleOperatePage0Ok1() {
    let params = this.operateForm1.value
    params.requisitionId = this.requisitionId
    this._http.post(`/api/requisition/cancel`, params).subscribe((res: any) => {
      if (res.success) {
        this.getDetail(this.requisitionId)
        this.msg.success(res.message);
        this.showOperatePage1 = false;
        this.operateForm1.reset()
      } else {
        this.msg.error(res.message);
      }
    })
  }


  // 添加备注
  showOperatePage3: boolean = false
  operateForm3: FormGroup = this.fb.group({
    opRemark: [null, [Validators.maxLength(300)]],
  })

  addRemark() {
    this.showOperatePage3 = true
  }

  handleOperatePage0Ok3() {
    let params = this.operateForm3.value
    params.requisitionId = this.requisitionId
    this._http.post(`/api/requisition/opRemark/add`, params).subscribe((res: any) => {
      if (res.success) {
        this.getDetail(this.requisitionId)
        this.msg.success(res.message);
        this.showOperatePage3 = false;
        this.operateForm3.reset();
      } else {
        this.msg.error(res.message);
      }
    })
  }


  showDetailPage: boolean = false;
  operateId: any = null;
  operateForm: FormGroup = this.fb.group({
    area: [null, [Validators.required,]],
    remark: [null, [Validators.maxLength(200)]],
  })


  requisitionId: string = '' //申领id
  getDetail(id: any) {
    this.isSpinning = true
    // this.geCompanyAfterSale()
    // this.getLogHistory(id)
    this.requisitionId = id
    Promise.all([
      // this.getDaultType(),
      // this.getAfterSaleType(),
      // this.getAfterSaleMode(),
      // this.getCompany(id),
      // this.getlistManufactor(),
      // this.getlistDeviceType(),
      // this.onProjectSearch()
    ]).then((value) => {

      this.detail(id)
    })
  }
  detailData: any = {
    fault_type_id: ''
  };
  workOrdertatus: number = 2
  detail(id: any) {//TODO FALSE
    this.operateId = id
    this._http.post(`/api/requisition/get`, { id }).subscribe((res: any) => {
      this.isSpinning = false
      if (res.success) {
        // this.workOrdertatus = res.data.status
        this.detailData = res.data;
        this.showDetailPage = true;
        this.changeTab()
        // })
      } else {
        this.msg.error(res.message);
      }
    })
  }
  //取消
  cancel() {
    this._http.post(`/api/requisition/get`, { requisitionId: this.requisitionId }).subscribe((res: any) => {
      this.isSpinning = false
      if (res.success) {

      } else {
        this.msg.error(res.message);
      }
    })
  }


  currentTab: number = 0;
  tableData0: any[] = []
  tableData1: any[] = []
  tableData2: any[] = []

  changeTab() {

    if (this.currentTab == 0) {
      this.getTableData0();
    }
    if (this.currentTab == 1) {
      this.getTableData1();
    }
    if (this.currentTab == 2) {
      this.getTableData2();

    }
  }

  operateForm0: FormGroup = this.fb.group({
    inventoryCode: [null, [Validators.required, Validators.maxLength(20)]],
    requestedQuantity: [null, [Validators.required, Validators.maxLength(20)]],
  })
  inventoryCode: string = ''
  showOperatePage0: boolean = false
  getTableData0() {
    this._http.post(`/api/requisition/registration/list`, { requisitionId: this.requisitionId }).subscribe((res: any) => {
      this.isSpinning = false
      if (res.success) {
        this.tableData0 = res.data;
      } else {
        this.msg.error(res.message);
      }
    })
  }
  // 存货编码 弹窗表格
  q3: any = {
    pageIndex: 1,
    pageSize: 10,
    total: 1,
  }
  proname3: string
  tableData3: any[] = []
  invontoryVis: boolean = false
  inventorySelected: any = { id: '' }; // 用于存储选中的行的 id

  selectInvontory() {
    let params = {
      page: this.q3.pageIndex,
      size: this.q3.pageSize,
      data: {
        name: this.proname3,
      }
    }
    this.loading = true;
    this._http.post('/api/accessory/ledger/page', params).subscribe((res: any) => {
      this.loading = false;
      if (res.success) {
        this.invontoryVis = true
        this.tableData3 = res.data;
        // this.inventorySelected = res.data[0] //默认第一
        //分页
        this.q3.total = res.additional_data.pagination.total;
      } else {
        this.msg.error(res.message);
      }
    })
  }
  //分页
  pageIndexChange3($event: any) {
    this.q3.pageIndex = $event;
    this.selectInvontory();
  }
  pageSizeChange3($event: any) {
    this.q3.pageSize = $event;
    this.selectInvontory();
  }

  search3() {
    //初始化分页
    this.q3 = {
      pageIndex: 1,
      pageSize: 10,
      total: 0,
    };
    this.selectInvontory();
  }
  handleRadioClick(event: Event, item: any) {
    event.stopPropagation(); // 阻止冒泡，以免触发 label 默认的选中行为
    this.tableData3.forEach(d => d.selected = (d.id === item.id));
    this.inventorySelected = item;

  }

  handleInvontoryCancel(): void {
    this.invontoryVis = false;
    this.proname3 = '';
    this.inventorySelected = { id: '' };
  }
  handleInvontoryOk(): void {
    if (this.inventorySelected.id) {
      this.operateForm0.get('inventoryCode').setValue(this.inventorySelected.inventoryCode);
      this.invontoryVis = false;

    } else {
      this.msg.warning('请选择')
    }
  }



  // 存货操作
  operateId0: any

  add() {
    let params = this.operateForm0.value
    params.requisitionId = this.requisitionId
    this.btnLoading = true;
    this._http.post(`/api/requisition/registration/add`, params).subscribe((res: any) => {
      this.btnLoading = false;
      if (res.success) {
        this.getTableData0();
        this.operateForm0.reset()
      } else {
        this.msg.error(res.message);
      }
    })
  }
  modify(id: any) {

    this.operateId0 = id;
    this.showOperatePage0 = true;
  }
  handleOperatePage0Ok() {
    this.btnLoading = true;
    if (!this.operateForm0.value.requestedQuantity) {
      this.msg.error('填写数量')
      return
    }
    let params = {
      requestedQuantity: this.operateForm0.value.requestedQuantity,
      id: this.operateId0
    }
    params.id = this.operateId0
    this._http.post(`/api/requisition/registration/update`, params).subscribe((res: any) => {
      this.btnLoading = false;
      if (res.success) {
        this.getTableData0();
        this.showOperatePage0 = false
        this.msg.success(res.message);
      } else {
        this.msg.error(res.message);
      }
    })


  }


  modifyData(params: any) {

  }
  delete(id: any) {
    this.modal.confirm({
      nzContent: '确定删除此条数据？',
      nzOkText: '确认',
      nzCancelText: '取消',
      nzTitle: '删除',
      nzOnOk: () => {
        this._http.post(`/api/requisition/registration/delete`, { id }).subscribe((res: any) => {
          this.btnLoading = false;
          if (res.success) {
            this.getTableData0();
            this.msg.success(res.message);
          } else {
            this.msg.error(res.message);
          }
        })
      },
      nzOnCancel: () => { }
    })

  }

  // 登记
  overBookin() {
    this._http.post(`/api/requisition/register`, { requisitionId: this.requisitionId }).subscribe((res: any) => {
      this.isSpinning = false
      if (res.success) {
        this.detail(this.operateId)
        this.msg.success(res.message);
      } else {
        this.msg.error(res.message);
      }
    })
  }
  reBookin() {
    this._http.post(`/api/requisition/re-register`, { requisitionId: this.requisitionId }).subscribe((res: any) => {
      this.isSpinning = false
      if (res.success) {
        this.detail(this.operateId)
        this.msg.success(res.message);
      } else {
        this.msg.error(res.message);
      }
    })
  }


  getTableData1() {
    this._http.post(`/api/requisition/shipping/list`, { requisitionId: this.requisitionId }).subscribe((res: any) => {
      this.isSpinning = false
      if (res.success) {
        this.tableData1 = res.data;
      } else {
        this.msg.error(res.message);
      }
    })
  }


  // 核销
  getTableData2() {
    this._http.post(`/api/requisition/verificationDeductions/list`, { requisitionId: this.requisitionId }).subscribe((res: any) => {
      this.isSpinning = false
      if (res.success) {
        this.tableData2 = res.data;
      } else {
        this.msg.error(res.message);
      }
    })
  }
  operateForm2: FormGroup = this.fb.group({
    inventoryCode: [null, [Validators.required, Validators.maxLength(20)]],
    deductionQuantity: [null, [Validators.required, Validators.maxLength(20)]],
    reason: [null, [Validators.maxLength(200)]],
  })
  showOperatePage2: boolean = false
  operateId2: any
  add2() {
    this.showOperatePage2 = true;
  }

  handleOperatePage2Ok() {
    this.btnLoading = true;
    for (const i in this.operateForm2.controls) {
      this.operateForm2.controls[i].markAsDirty();
      this.operateForm2.controls[i].updateValueAndValidity();
    }
    if (this.operateForm2.invalid) {
      return
    }
    let params: any = {};
    let data = JSON.parse(JSON.stringify(this.operateForm2.value));
    params = data;
    params.requisitionId = this.requisitionId
    this._http.post(`/api/requisition/verificationDeductions/add`, params).subscribe((res: any) => {
      this.btnLoading = false;
      if (res.success) {
        this.getTableData2();
        this.showOperatePage2 = false
        this.msg.success(res.message);
        this.operateForm2.reset()
      } else {
        this.msg.error(res.message);
      }
    })


  }


  delete2(id: any) {
    this.modal.confirm({
      nzContent: '确定删除此条数据？',
      nzOkText: '确认',
      nzCancelText: '取消',
      nzTitle: '删除',
      nzOnOk: () => {
        this._http.post(`/api/requisition/verificationDeductions/delete`, { id }).subscribe((res: any) => {
          this.btnLoading = false;
          if (res.success) {
            this.getTableData2();
          } else {
            this.msg.error(res.message);
          }
        })
      },
      nzOnCancel: () => { }
    })

  }




  //验证时间
  validateQuery(start: any, end: any) {

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

  beforeUpload = (file: File) => {
    //验证图片是否合格
    return new Observable((observer: Observer<boolean>) => {
      const isLt5M = (file.size / 1024 / 1024) < 10;
      if (!isLt5M) {
        this.msg.error('文件必须小于10MB!');
        observer.complete();
        return;
      }
      observer.next(true);
      observer.complete();
    })
  }

  // 大图
  bigImgVisible: boolean = false
  bigImgSrc: string = ""
  lookUpImg = (file) => {
    this.bigImgSrc = file
    this.bigImgVisible = true;
  };

}
