import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComplaintsAnalyticsComponent } from './complaints-analytics.component';

describe('ComplaintsAnalyticsComponent', () => {
  let component: ComplaintsAnalyticsComponent;
  let fixture: ComponentFixture<ComplaintsAnalyticsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComplaintsAnalyticsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComplaintsAnalyticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
