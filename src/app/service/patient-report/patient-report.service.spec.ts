import { TestBed } from '@angular/core/testing';

import { PatientReportService } from './patient-report.service';

describe('PatientReportService', () => {
  let service: PatientReportService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PatientReportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
