import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoktorDashboardComponent } from './doktor-dashboard.component';

describe('DoktorDashboardComponent', () => {
  let component: DoktorDashboardComponent;
  let fixture: ComponentFixture<DoktorDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DoktorDashboardComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(DoktorDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
