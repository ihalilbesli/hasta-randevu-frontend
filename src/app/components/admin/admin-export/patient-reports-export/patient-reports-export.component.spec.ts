import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientReportsExportComponent } from './patient-reports-export.component';

describe('PatientReportsExportComponent', () => {
  let component: PatientReportsExportComponent;
  let fixture: ComponentFixture<PatientReportsExportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PatientReportsExportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PatientReportsExportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
