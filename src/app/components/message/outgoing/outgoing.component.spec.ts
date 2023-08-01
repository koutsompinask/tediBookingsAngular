import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OutgoingComponent } from './outgoing.component';

describe('OutgoingComponent', () => {
  let component: OutgoingComponent;
  let fixture: ComponentFixture<OutgoingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OutgoingComponent]
    });
    fixture = TestBed.createComponent(OutgoingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
