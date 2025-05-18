import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientHistoriesExportComponent } from './patient-histories-export.component';

describe('PatientHistoriesExportComponent', () => {
  let component: PatientHistoriesExportComponent;
  let fixture: ComponentFixture<PatientHistoriesExportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PatientHistoriesExportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PatientHistoriesExportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
