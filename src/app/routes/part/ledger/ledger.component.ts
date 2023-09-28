import { Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import moment from 'moment';
import { txtStatus } from '../../../../utils/public';
import { ExcelService } from '@core/excel/excel.service';


@Component({
  selector: 'app-ledger',
  templateUrl: './ledger.component.html',
  styleUrls: ['./ledger.component.less']
})
export class LedgerComponent implements OnInit {


  tableData: any[] = [];
  loading: boolean = false;
  btnLoading: boolean = false;
  isSpinning: boolean = false
  q: any = {
    pageIndex: 1,
    pageSize: 10,
    total: 1,
  }
  projectName: any;
  endDate0: any = new Date();
  startDate0: any = new Date(new Date().getTime() - 30 * 24 * 3600 * 1000);
  isOwner: boolean = true
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
    if (this.validateQuery(this.startDate0, this.endDate0)) {
      let params = {
        page: this.q.pageIndex,
        size: this.q.pageSize,
        data: {
          beginTime: moment(this.startDate0).format('YYYYMMDD'),
          endTime: moment(this.endDate0).format('YYYYMMDD'),
          isOwner: this.isOwner

        }

      }
      this.loading = true;
      this._http.post('/api/requisition/ledger/page', params).subscribe((res: any) => {
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

  handleCheckChange($event) {
    this.getTableData()
  }



  // 下载
  download() {
    let params = {
      page: this.q.pageIndex,
      size: this.q.pageSize,
      data: {
        beginTime: moment(this.startDate0).format('YYYYMMDD'),
        endTime: moment(this.endDate0).format('YYYYMMDD'),
        isOwner: this.isOwner

      }

    }

    this.ExcelService.download('/api/requisition/ledger/export', params, '出库台账')
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

  // 大图
  bigImgVisible: boolean = false
  bigImgSrc: string = ""
  lookUpImg = (file) => {
    this.bigImgSrc = file
    this.bigImgVisible = true;
  };

}
