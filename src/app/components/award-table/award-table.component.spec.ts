import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AwardTableComponent } from './award-table.component';

describe('AwardTableComponent', () => {
  let component: AwardTableComponent;
  let fixture: ComponentFixture<AwardTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AwardTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AwardTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
