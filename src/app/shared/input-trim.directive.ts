import { Directive, ElementRef, HostListener } from '@angular/core';
import { FormGroup, FormControl, NgControl } from '@angular/forms';
@Directive({
  selector: '[appInputTrim]'
})
export class InputTrimDirective {

  constructor(
    public el: ElementRef,
    public control: NgControl,
  ) { }
  @HostListener("input", ["$event", "$event.target"])
  inputFn($event: any, target: any) {
    if (target.value) {
      this.control.control.setValue(target.value.trim());
    }
  }

}
