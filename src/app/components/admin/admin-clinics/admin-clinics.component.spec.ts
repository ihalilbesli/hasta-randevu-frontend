import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminClinicsComponent } from './admin-clinics.component';

describe('AdminClinicsComponent', () => {
  let component: AdminClinicsComponent;
  let fixture: ComponentFixture<AdminClinicsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminClinicsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminClinicsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
