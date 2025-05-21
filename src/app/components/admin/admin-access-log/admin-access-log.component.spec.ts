import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminAccessLogComponent } from './admin-access-log.component';

describe('AdminAccessLogComponent', () => {
  let component: AdminAccessLogComponent;
  let fixture: ComponentFixture<AdminAccessLogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminAccessLogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminAccessLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
