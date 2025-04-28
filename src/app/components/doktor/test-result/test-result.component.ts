import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../../header/header.component';
import { TestResultService } from '../../../service/test-result/test-result.service';
import { DoctorPatientService } from '../../../service/doctorPatient/doctor-patient.service';
import { UserService } from '../../../service/user-service/user-service.service';
import { AuthService } from '../../../service/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-test-result',
  standalone: true,
  imports: [CommonModule,FormsModule,HeaderComponent],
  templateUrl: './test-result.component.html',
  styleUrl: './test-result.component.css'
})
export class TestResultComponent {
  activeTab: '' | 'add' | 'list' = '';
  patients: any[] = [];
  selectedPatientId: number | null = null;

  testName: string = '';
  testType: string = 'DIGER';
  doctorComment: string = '';
  testDate: string = '';

  testParameters: { name: string, value: string }[] = [];
  testResults: any[] = [];

  doctorId: number | null = null;
  currentUserName: string = '';
  isLoading: boolean = false;

  editingTestId: number | null = null; // 🔥 Düzenleme yapılacak test sonucu ID'si

  constructor(
    private testResultService: TestResultService,
    private doctorPatientService: DoctorPatientService,
    private userService: UserService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.userService.getCurrentUser().subscribe({
      next: (user: any) => {
        this.doctorId = user.id;
        this.currentUserName = `${user.name} ${user.surname}`;
        this.loadPatients();
        this.testType = 'DIGER';
        this.onTestTypeChange();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Kullanıcı alınamadı:', error);
        this.isLoading = false;
      }
    });
  }

  loadPatients(): void {
    this.doctorPatientService.getMyPatientsToday().subscribe({
      next: (patients) => {
        this.patients = patients;
      },
      error: (error) => {
        console.error('Bugünkü hastalar yüklenemedi:', error);
      }
    });
  }

  loadTestResults(): void {
    if (this.selectedPatientId) {
      this.testResultService.getTestResultsByPatientId(this.selectedPatientId).subscribe({
        next: (results) => {
          this.testResults = results;
        },
        error: (error) => {
          console.error('Test sonuçları yüklenemedi:', error);
          this.testResults = [];
        }
      });
    } else {
      this.testResults = [];
    }
  }

  onPatientChange(): void {
    if (this.selectedPatientId) {
      this.loadTestResults();
      this.activeTab = '';
    } else {
      this.testResults = [];
      this.activeTab = '';
    }
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
        this.testParameters = [
          { name: 'Beyin Görüntüsü Yorumu', value: '' }
        ];
        break;
      case 'TOMOGRAFI':
        this.testParameters = [
          { name: 'Akciğer Görüntüsü Yorumu', value: '' }
        ];
        break;
      case 'DIGER':
      default:
        this.testParameters = [];
        break;
    }
  }

  createTestResult(): void {
    if (this.selectedPatientId && this.testDate) {
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
        this.testResultService.updateTestResult(this.editingTestId, testResultData).subscribe({
          next: () => {
            alert('Test sonucu başarıyla güncellendi!');
            this.editingTestId = null;
            this.resetForm();
            this.loadTestResults();
          },
          error: (error) => {
            console.error('Test sonucu güncellenemedi:', error);
          }
        });
      } else {
        this.testResultService.createTestResult(testResultData).subscribe({
          next: () => {
            alert('Test sonucu başarıyla eklendi!');
            this.resetForm();
            this.loadTestResults();
          },
          error: (error) => {
            console.error('Test sonucu eklenemedi:', error);
          }
        });
      }
    } else {
      alert('Lütfen hasta seçin ve tarih belirleyin.');
    }
  }

  resetForm(): void {
    this.testName = '';
    this.testType = 'DIGER';
    this.doctorComment = '';
    this.testDate = '';
    this.testParameters = [];
    this.editingTestId = null;
    this.onTestTypeChange();
  }

  deleteTestResult(id: number): void {
    if (confirm('Bu test sonucunu silmek istediğinize emin misiniz?')) {
      this.testResultService.deleteTestResult(id).subscribe({
        next: () => {
          alert('Test sonucu başarıyla silindi!');
          this.loadTestResults();
        },
        error: (error) => {
          console.error('Test sonucu silinemedi:', error);
        }
      });
    }
  }

  editTestResult(test: any): void {
    this.editingTestId = test.id;
  
    this.testName = test.testName;
    this.testType = test.testType;
    this.doctorComment = test.doctorComment;
    this.testDate = test.testDate;
  
    this.onTestTypeChange(); // Önce test tipine göre parametreleri yükleyelim
  
    // 🔥 Şimdi test.result içindeki değerleri inputlara dağıtalım
    if (test.result) {
      const lines: string[] = test.result.split('\n'); // Satırlara ayır, tipi string[]
      lines.forEach((line: string) => {
        const parts: string[] = line.split(':').map((part: string) => part.trim()); // Split sonrası trimle
        const paramName = parts[0];
        const paramValue = parts[1];
        const param = this.testParameters.find(p => p.name === paramName);
        if (param) {
          param.value = paramValue; // Değeri inputa yükle
        }
      });
    }
  
    this.activeTab = 'add'; // Formu aç
  }

  getFormattedTestType(testType: string): string {
    switch (testType) {
      case 'KAN_TAHLILI':
        return 'Kan Tahlili';
      case 'IDRAR_TAHLILI':
        return 'İdrar Tahlili';
      case 'MRI':
        return 'MRI';
      case 'TOMOGRAFI':
        return 'Tomografi';
      default:
        return 'Test';
    }
  }
}
