import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EnlistComponent } from './enlist.component';

describe('EnlistComponent', () => {
  let component: EnlistComponent;
  let fixture: ComponentFixture<EnlistComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EnlistComponent]
    });
    fixture = TestBed.createComponent(EnlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
