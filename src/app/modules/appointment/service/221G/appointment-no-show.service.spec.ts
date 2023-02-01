import { TestBed } from '@angular/core/testing';

import { AppointmentNoShowService } from './appointment-no-show.service';

describe('AppointmentNoShowService', () => {
  let service: AppointmentNoShowService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AppointmentNoShowService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
