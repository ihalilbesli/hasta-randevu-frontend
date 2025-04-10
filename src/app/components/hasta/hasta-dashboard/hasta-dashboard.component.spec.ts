import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HastaDashboardComponent } from './hasta-dashboard.component';

describe('HastaDashboardComponent', () => {
  let component: HastaDashboardComponent;
  let fixture: ComponentFixture<HastaDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HastaDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HastaDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
