import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppointmentNoShowComponent } from './appointment-no-show.component';

describe('AppointmentNoShowComponent', () => {
  let component: AppointmentNoShowComponent;
  let fixture: ComponentFixture<AppointmentNoShowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppointmentNoShowComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppointmentNoShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
