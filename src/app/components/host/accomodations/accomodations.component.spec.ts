import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccomodationsComponent } from './accomodations.component';

describe('AccomodationsComponent', () => {
  let component: AccomodationsComponent;
  let fixture: ComponentFixture<AccomodationsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AccomodationsComponent]
    });
    fixture = TestBed.createComponent(AccomodationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
