import { Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import moment from 'moment';
import { txtStatus } from '../../../../utils/public';
import { ExcelService } from '@core/excel/excel.service';


@Component({
  selector: 'app-verified',
  templateUrl: './verified.component.html',
  styleUrls: ['./verified.component.less']
})
export class VerifiedComponent implements OnInit {

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
  isSpinning: boolean = false
  q: any = {
    pageIndex: 1,
    pageSize: 10,
    total: 1,
  }
  searchName: any;
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

    let params = {
      page: this.q.pageIndex,
      size: this.q.pageSize,
      data: {
        name: this.searchName,
        isOwner: this.isOwner

      }
    }
    this.loading = true;
    this._http.post('/api/requisition/verificationDeductions/page', params).subscribe((res: any) => {
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
  queryDisabledDate = (current: Date): boolean => {
    return current.getTime() > new Date(moment().format('YYYY-MM-DD')).getTime();
  };

}
