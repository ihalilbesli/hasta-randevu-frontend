import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppointmentsExportComponent } from './appointments-export.component';

describe('AppointmentsExportComponent', () => {
  let component: AppointmentsExportComponent;
  let fixture: ComponentFixture<AppointmentsExportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppointmentsExportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppointmentsExportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
