import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminAiComponent } from './admin-ai.component';

describe('AdminAiComponent', () => {
  let component: AdminAiComponent;
  let fixture: ComponentFixture<AdminAiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminAiComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminAiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
