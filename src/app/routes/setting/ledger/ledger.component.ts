import { Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NzMessageService, NzModalService, UploadXHRArgs } from 'ng-zorro-antd';
import { ExcelService } from '@core/excel/excel.service';
import { UploadFile } from 'ng-zorro-antd/upload';
import { Observable, Observer } from 'rxjs';

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
  isStop: string
  isSafe: string
  type: string
  matter: string
  getTableData() {
    let params = {
      page: this.q.pageIndex,
      size: this.q.pageSize,
      data: {
        name: this.proname,
        "isDisabled": this.isStop,
        "classification": this.type,
        "isSafetyAccessory": this.isSafe,
        "accessoryCategoryId": this.matter
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
  operateForm: FormGroup = this.fb.group({
    unitPrice: [null],
    note: [null],
    accessoryCategoryId: [null],
    isSafetyAccessory: [false],
    safetyThreshold: [null],
    warningThreshold: [null],
    "classification": [null],
    "seriesName": [''],
    "seriesVersion": [null],
    isDisabled: [false],

  });
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
        this.listOfFilter = res.data
      } else {
        this.msg.error(res.message);
      }
    })
  }




  showUploadList = {
    showPreviewIcon: true,
    showRemoveIcon: true,
    hidePreviewIconInNonImage: true
  };

  previewImage: string | undefined = '';
  previewVisible = false;


  handlePreview = (file: UploadFile) => {
    this.previewImage = file.url || file.thumbUrl;
    this.previewVisible = true;
  };


  detailData: any



  getDetail(params) {
    return new Promise((rso, rej) => {
      this._http.post('/api/accessory/get', params).subscribe((res: any) => {
        if (res.success) {
          rso(res)
        } else {
          rej(res)
          this.msg.error(res.message);
        }
      })
    })

  }
  lookUpimg(data) {
    //放大图片初始化数据
    this.totalIdx = 0;
    this.imgList = [];
    data.map((item: any) => {
      item.index = this.totalIdx++;
      this.imgList.push(item);
    })
    this.showBigImg = true;
    this.imgIdx = 0

  }

  showBigImg: boolean = false;
  imgList: any[] = [];
  imgIdx: number = 0;
  totalIdx: number = 0;
  bigImg(idx: any) {
    this.imgIdx = idx;
  }
  goPre() {
    if (this.imgIdx >= 1) {
      this.imgIdx--;
    }
  }
  goNext() {
    if (this.imgIdx < (this.totalIdx - 1)) {
      this.imgIdx++;
    }
  }

  modify(data: any) {
    this.operateId = data;

    this.getDetail({
      id: data
    }).then((res: any) => {
      this.detailData = res.data
      this.operateForm.patchValue(res.data)
      this.showOperatePage = true;
      this.fileList = res.data.photoList



    })

  }
  saveOperateData() {
    for (const i in this.operateForm.controls) {
      this.operateForm.controls[i].markAsDirty();
      this.operateForm.controls[i].updateValueAndValidity();
    }
    // if (this.operateForm.invalid) {
    //   return
    // }
    let params: any = {};
    let data = JSON.parse(JSON.stringify(this.operateForm.value));
    params = data;

    params.photoList = this.fileList.map(item => 'response' in item ? item.response : item)

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



  //文件上传
  fileList: any[] = [];
  //上传图片
  fileUpload = (item: UploadXHRArgs) => {
    const formData = new FormData();
    formData.append('file', item.file as any);
    return this._http.post(`/api/common/upload/picture`, formData).subscribe((res: any) => {
      if (res.success) {
        item.onSuccess(res.data, item.file, {});
      } else {
        item.onError(true, item.file);
      }
    })
  }
  beforeUpload = (file: File) => {
    //验证图片是否合格
    return new Observable((observer: Observer<boolean>) => {
      const isLt5M = (file.size / 1024 / 1024) < 5;
      if (!isLt5M) {
        this.msg.error('文件必须小于5MB!');
        observer.complete();
        return;
      }
      observer.next(true);
      observer.complete();
    })
  }

}
