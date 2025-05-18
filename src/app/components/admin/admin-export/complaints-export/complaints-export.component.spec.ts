import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComplaintsExportComponent } from './complaints-export.component';

describe('ComplaintsExportComponent', () => {
  let component: ComplaintsExportComponent;
  let fixture: ComponentFixture<ComplaintsExportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComplaintsExportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComplaintsExportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
