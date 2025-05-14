import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppointmentAnalyticsComponent } from './appointment-analytics.component';

describe('AppointmentAnalyticsComponent', () => {
  let component: AppointmentAnalyticsComponent;
  let fixture: ComponentFixture<AppointmentAnalyticsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppointmentAnalyticsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppointmentAnalyticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
