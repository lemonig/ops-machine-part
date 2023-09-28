import { Directive, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
@Directive({
  selector: '[appMultiTitleScroll]'
})
export class MultiTitleScrollDirective implements AfterViewInit, OnDestroy {
  //滚动warp元素
  warpElement: any;
  //滚动元素(head)
  tableHeadEl: any;
  siblingHead: any[] = [];
  constructor(
    public el: ElementRef,
  ) {
  }
  ngAfterViewInit() {
    //渲染完后再获取元素
    setTimeout(() => {
      this.warpElement = document.getElementById('tableHeight');
      //滚动到顶部
      //防止表格滚动错乱
      if (this.warpElement) {
        this.warpElement.scrollTo(0, 0);
        this.tableHeadEl = this.el.nativeElement;
        this.siblingHead = Array.from(this.tableHeadEl.parentNode.children).reverse();
        this.warpElement.addEventListener('scroll', this.scrollFn);
      }
    }, 2000)
  }
  ngOnDestroy() {
    if (this.warpElement) {
      this.warpElement.removeEventListener('scroll', this.scrollFn)
    }
  }
  scrollFn = () => {
    this.scrollPage();
  }
  scrollPage() {
    let scrollTop = this.warpElement.scrollTop;
    if (scrollTop >= 0) {
      this.siblingHead.map((item: any) => {
        item.style.transform = `translateY( ${scrollTop - 1}px )`;
      })
    } else {
      this.siblingHead.map((item: any) => {
        item.style.transform = `translateY( 0px )`;
      })
    }
  }
}
