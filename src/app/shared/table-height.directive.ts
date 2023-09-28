import { Directive, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';

@Directive({
  selector: '[appTableHeight]'
})
export class TableHeightDirective implements AfterViewInit, OnDestroy {
  //系统所属
  systemBelong: any;
  constructor(
    public el: ElementRef,
  ) {
    //获取系统所属
    this.systemBelong = localStorage.getItem('footerMessage');
  }
  ngAfterViewInit() {
    this.setScrollHeight();
    window.addEventListener('resize', this.setScrollHeight);
  }
  ngOnDestroy() {
    window.removeEventListener('resize', this.setScrollHeight);
  }

  setScrollHeight = () => {
    //获取可以滚动的高度
    setTimeout(() => {
      let total = document.documentElement.clientHeight;
      let top = this.el.nativeElement.getBoundingClientRect().top;
      let bottom = this.systemBelong ? 24 : 0;
      let canScrollHeight = total - top - bottom - 24;
      this.el.nativeElement.style.height = canScrollHeight + 'px';
    })
  }
}
