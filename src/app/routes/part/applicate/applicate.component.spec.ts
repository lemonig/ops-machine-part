import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicateComponent } from './applicate.component';

describe('ApplicateComponent', () => {
  let component: ApplicateComponent;
  let fixture: ComponentFixture<ApplicateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApplicateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplicateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
