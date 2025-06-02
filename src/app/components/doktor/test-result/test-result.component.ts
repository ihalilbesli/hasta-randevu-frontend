import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../../header/header.component';
import { TestResultService } from '../../../service/test-result/test-result.service';
import { DoctorPatientService } from '../../../service/doctorPatient/doctor-patient.service';
import { UserService } from '../../../service/user-service/user-service.service';

@Component({
  selector: 'app-test-result',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './test-result.component.html',
  styleUrl: './test-result.component.css'
})
export class TestResultComponent {
  patients: any[] = [];
  selectedPatientId: number | null = null;
  activeTab: '' | 'add' | 'list' = '';
  patientMode: 'today' | 'all' = 'today';

  doctorId: number | null = null;
  currentUserName: string = '';

  testName: string = '';
  testType: string = 'DIGER';
  doctorComment: string = '';
  testDate: string = '';
  testParameters: { name: string, value: string }[] = [];
  testResults: any[] = [];
  editingTestId: number | null = null;

  constructor(
    private testResultService: TestResultService,
    private doctorPatientService: DoctorPatientService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.userService.getCurrentUser().subscribe({
      next: (user) => {
        this.doctorId = user.id;
        this.currentUserName = `${user.name} ${user.surname}`;
        this.loadPatients();
        this.onTestTypeChange();
      }
    });
  }

  selectPatientMode(mode: 'today' | 'all'): void {
    this.patientMode = mode;
    this.selectedPatientId = null;
    this.activeTab = '';
    this.testResults = [];
    this.loadPatients();
  }

  loadPatients(): void {
    if (this.patientMode === 'today') {
      this.doctorPatientService.getMyPatientsToday().subscribe({
        next: (res) => this.patients = res
      });
    } else {
      this.doctorPatientService.getMyPatients().subscribe({
        next: (res) => this.patients = res
      });
    }
  }

  onPatientChange(): void {
    this.activeTab = '';
    this.testResults = [];
  }

  selectTab(tab: 'add' | 'list'): void {
    if (tab === 'add' && this.patientMode === 'all') {
      alert('Randevusuz hastaya test sonucu eklenemez.');
      return;
    }
    this.activeTab = tab;
    if (tab === 'list') {
      this.loadTestResults();
    }
  }

  goBack(): void {
    this.activeTab = '';
    this.selectedPatientId = null;
    this.testResults = [];
    this.resetForm();
  }

  onTestTypeChange(): void {
    switch (this.testType) {
      case 'KAN_TAHLILI':
        this.testParameters = [
          { name: 'Hemoglobin', value: '' },
          { name: 'Hematokrit', value: '' },
          { name: 'Lökosit (WBC)', value: '' },
          { name: 'Eritrosit (RBC)', value: '' },
          { name: 'Trombosit (PLT)', value: '' },
          { name: 'MCV', value: '' },
          { name: 'MCH', value: '' },
          { name: 'MCHC', value: '' },
          { name: 'RDW', value: '' },
          { name: 'Nötrofil Yüzdesi', value: '' },
          { name: 'Lenfosit Yüzdesi', value: '' },
          { name: 'Monosit Yüzdesi', value: '' },
          { name: 'Eozinofil Yüzdesi', value: '' },
          { name: 'Bazofil Yüzdesi', value: '' }
        ];
        break;
      case 'IDRAR_TAHLILI':
        this.testParameters = [
          { name: 'Protein', value: '' },
          { name: 'Glukoz', value: '' }
        ];
        break;
      case 'MRI':
        this.testParameters = [{ name: 'Beyin Görüntüsü Yorumu', value: '' }];
        break;
      case 'TOMOGRAFI':
        this.testParameters = [{ name: 'Akciğer Görüntüsü Yorumu', value: '' }];
        break;
      default:
        this.testParameters = [];
    }
  }

  createTestResult(): void {
    if (!this.selectedPatientId || !this.testDate) {
      alert('Lütfen hasta ve tarih seçin.');
      return;
    }

    if (!this.testName.trim()) {
      this.testName = `${this.currentUserName} - ${this.getFormattedTestType(this.testType)}`;
    }

    const resultDetails = this.testParameters
      .filter(param => param.value.trim() !== '')
      .map(param => `${param.name}: ${param.value}`)
      .join('\n');

    const testResultData = {
      patient: { id: this.selectedPatientId },
      testName: this.testName,
      testType: this.testType,
      result: resultDetails,
      doctorComment: this.doctorComment,
      testDate: this.testDate
    };

    if (this.editingTestId) {
      this.testResultService.updateTestResult(this.editingTestId, testResultData).subscribe(() => {
        alert('Güncellendi.');
        this.resetForm();
        this.loadTestResults();
        this.activeTab = 'list';
      });
    } else {
      this.testResultService.createTestResult(testResultData).subscribe(() => {
        alert('Eklendi.');
        this.resetForm();
        this.activeTab = '';
      });
    }
  }

  loadTestResults(): void {
    if (!this.selectedPatientId) return;
    this.testResultService.getTestResultsByPatientId(this.selectedPatientId).subscribe({
      next: (res) => this.testResults = res
    });
  }

  editTestResult(test: any): void {
    this.editingTestId = test.id;
    this.testName = test.testName;
    this.testType = test.testType;
    this.doctorComment = test.doctorComment;
    this.testDate = test.testDate;
    this.onTestTypeChange();

    if (test.result) {
      const lines = test.result.split('\n');
      lines.forEach((line: string) => {
        const [key, val] = line.split(':').map(x => x.trim());
        const param = this.testParameters.find(p => p.name === key);
        if (param) param.value = val;
      });
    }

    this.activeTab = 'add';
  }

  deleteTestResult(id: number): void {
    if (confirm('Silmek istiyor musunuz?')) {
      this.testResultService.deleteTestResult(id).subscribe(() => {
        alert('Silindi.');
        this.loadTestResults();
      });
    }
  }

  resetForm(): void {
    this.testName = '';
    this.testType = 'DIGER';
    this.testDate = '';
    this.doctorComment = '';
    this.testParameters = [];
    this.editingTestId = null;
    this.onTestTypeChange();
  }

  getFormattedTestType(type: string): string {
    switch (type) {
      case 'KAN_TAHLILI': return 'Kan Tahlili';
      case 'IDRAR_TAHLILI': return 'İdrar Tahlili';
      case 'MRI': return 'MRI';
      case 'TOMOGRAFI': return 'Tomografi';
      default: return 'Test';
    }
  }
}
