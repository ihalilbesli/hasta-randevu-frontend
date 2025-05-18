import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrescriptionsExportComponent } from './prescriptions-export.component';

describe('PrescriptionsExportComponent', () => {
  let component: PrescriptionsExportComponent;
  let fixture: ComponentFixture<PrescriptionsExportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrescriptionsExportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrescriptionsExportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
