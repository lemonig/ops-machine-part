import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StatisComponent } from './statis.component';

describe('StatisComponent', () => {
  let component: StatisComponent;
  let fixture: ComponentFixture<StatisComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StatisComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StatisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
