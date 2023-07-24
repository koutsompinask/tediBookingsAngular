import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditAccomodationComponent } from './edit-accomodation.component';

describe('EditAccomodationComponent', () => {
  let component: EditAccomodationComponent;
  let fixture: ComponentFixture<EditAccomodationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditAccomodationComponent]
    });
    fixture = TestBed.createComponent(EditAccomodationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
