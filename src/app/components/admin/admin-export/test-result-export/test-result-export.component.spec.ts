import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestResultExportComponent } from './test-result-export.component';

describe('TestResultExportComponent', () => {
  let component: TestResultExportComponent;
  let fixture: ComponentFixture<TestResultExportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestResultExportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestResultExportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
