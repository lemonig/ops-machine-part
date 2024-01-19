import { Component, OnInit, ViewChild } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { FormGroup, FormBuilder, Validators, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { NzFormatEmitEvent, NzTreeNodeOptions } from 'ng-zorro-antd/core';
import { NzTreeComponent } from 'ng-zorro-antd/tree';
import { BehaviorSubject, Observable } from 'rxjs';
import { debounceTime, map, switchMap } from 'rxjs/operators';
@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.less']
})
export class UserComponent implements OnInit {
  @ViewChild('nzTreeComponent', { static: false }) nzTreeComponent: NzTreeComponent;
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
    this.getTree()


    const getRandomNameList = (name: string) =>
      this._http
        .post(`/api/user/searchAvailableUser`, {
          name: name
        })
        .pipe(map((res: any) => res.data))
        .pipe(
          map((list: any) => {
            return list.map((item: any) => ({
              ...item,
              label: item.nickname,
              value: item.id
            }));
          })
        );
    const optionList$: Observable<any[]> = this.searchChange$
      .asObservable()
      .pipe(debounceTime(500))
      .pipe(switchMap(getRandomNameList));
    optionList$.subscribe(data => {
      this.listOfOption = data;
      this.isLoading = false;
    });

  }
  getTableData() {
    let params = {};
    this.loading = true;
    this._http.post('/api/user/page', params).subscribe((res: any) => {
      this.loading = false;
      if (res.success) {
        this.tableData = res.data;
      } else {
        this.msg.error(res.message);
      }
    })
  }

  forbiddenNameValidator(nameRe: RegExp): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const forbidden = nameRe.test(control.value);
      return forbidden ? null : { forbiddePsw: { value: control.value } };
    };
  }



  showOperatePage: boolean = false;
  operateId: any = null;
  operateForm: FormGroup;
  detailData: any
  modify(id: any) {
    this.operateId = id;
    this._http.post(`/api/user/get`, { id }).subscribe((res: any) => {
      if (res.success) {
        this.detailData = res.data
        this.operateForm = this.fb.group({
          opAssistantPermission: [res.data.opAssistantPermission,],
          safetyStockPermission: [res.data.safetyStockPermission,],
          opManagerPermission: [res.data.opManagerPermission,],
          systemSettingsPermission: [res.data.systemSettingsPermission, [Validators.required]],
          regionCodeList: [res.data.regionCodeList, []],
        })
        this.showOperatePage = true;
        this.defaultCheckedKeys = res.data.regionCodeList
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
    params.id = this.operateId;
    params.regionCodeList = this.defaultCheckedKeys
    this.modifyData(params);
  }
  addData(params: any) {
    this.btnLoading = true;
    this._http.post(`api/user/add`, params).subscribe((res: any) => {
      this.btnLoading = false;
      if (res.success) {
        this.getTableData();
        this.showAddPage = false;
        this.addForm.reset()
      } else {
        this.msg.error(res.message);
      }
    })
  }
  modifyData(params: any) {
    this.btnLoading = true;
    this._http.post(`/api/user/update`, params).subscribe((res: any) => {
      this.btnLoading = false;
      if (res.success) {
        this.getTableData();
        this.showOperatePage = false;
      } else {
        this.msg.error(res.message);
      }
    })
  }

  searchChange$ = new BehaviorSubject('');
  //添加
  addForm: FormGroup = this.fb.group({
    idList: [null, [Validators.required]]

  });
  showAddPage: boolean = false;
  listOfOption: Array<{ label: string; value: string }> = [];
  isLoading = false;
  onSearch(value: string): void {
    this.isLoading = true;
    this.searchChange$.next(value);
  }


  add() {
    this.showAddPage = true



    // this._http.post(`/api/user/searchAvailableUser`,).subscribe((res: any) => {
    //   if (res.success) {
    //     this.listOfOption = res.data.map(item => ({
    //       ...item,
    //       label: item.nickname,
    //       value: item.id
    //     }))
    //     this.showAddPage = true
    //   } else {
    //     this.msg.error(res.message);
    //   }
    // })
  }
  confirmSelect() {
    for (const i in this.addForm.controls) {
      this.addForm.controls[i].markAsDirty();
      this.addForm.controls[i].updateValueAndValidity();
    }
    if (this.addForm.invalid) {
      return
    }
    let params: any = {};
    let data = JSON.parse(JSON.stringify(this.addForm.value));
    this.addData(data)
  }
  // 区域选择



  getTree() {
    this._http.post(`/api/common/region/tree`).subscribe((res: any) => {
      if (res.success) {
        this.loopTree(res.data)
        this.nodes = res.data

      }
    })

  }


  loopTree(tree) {
    let count = 0
    function loop(node) {
      if (!Array.isArray(node)) {
        return
      }
      for (let i of node) {
        if (!i.children.length) {
          delete i.children
        }
        count += 1
        loop(i.children)
      }
    }
    loop(tree)

  }
  defaultCheckedKeys: any[] = [];
  defaultSelectedKeys = [];
  defaultExpandedKeys = [];

  nodes: NzTreeNodeOptions[] = [

  ];


  nzCheck(event: NzFormatEmitEvent): void {
    this.defaultCheckedKeys = event.keys
  }



  ngAfterViewInit(): void {
    // get node by key: '10011'
    // console.log(this.nzTreeComponent.getTreeNodeByKey('10011'));
    // use tree methods
    // console.log(
    //   this.nzTreeComponent.getTreeNodes(),
    //   this.nzTreeComponent.getCheckedNodeList(),
    //   this.nzTreeComponent.getSelectedNodeList(),
    //   this.nzTreeComponent.getExpandedNodeList()
    // );
  }
}