import { Directive, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
@Directive({
  selector: '[appTableScroll]'
})
export class TableScrollDirective implements AfterViewInit, OnDestroy {
  //滚动warp元素
  warpElement: any;
  //滚动元素(head)
  tableHeadEl: any;
  constructor(
    public el: ElementRef,
  ) {
  }
  ngAfterViewInit() {
    setTimeout(() => {
      this.warpElement = document.getElementById('tableHeight');
      //滚动到顶部
      if (this.warpElement) {
        this.warpElement.scrollTo(0, 0);
        this.tableHeadEl = this.el.nativeElement;
        this.warpElement.addEventListener('scroll', this.scrollFn);
      }
    }, 2000)
  }
  ngOnDestroy() {
    if (this.warpElement) {
      this.warpElement.removeEventListener('scroll', this.scrollFn);
    }
  }
  scrollFn = () => {
    this.scrollPage();
  }
  scrollPage() {
    let scrollTop = this.warpElement.scrollTop;
    if (scrollTop >= 0) {
      this.tableHeadEl.style.transform = `translateY( ${scrollTop - 1}px )`;
    } else {
      this.tableHeadEl.style.transform = `translateY( 0px )`;
    }
  }



}
