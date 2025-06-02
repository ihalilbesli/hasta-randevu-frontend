import { Component } from '@angular/core';
import { AppointmentService } from '../../../service/appoinment/appointment.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../header/header.component';
import { PrescriptionService } from '../../../service/presccription/prescription.service';
import { TestResultService } from '../../../service/test-result/test-result.service';
import { PatientHistoryService } from '../../../service/patient-history/patient-history.service';
import { PatientReportService } from '../../../service/patient-report/patient-report.service';
import { UserService } from '../../../service/user-service/user-service.service';
import { DoctorPatientService } from '../../../service/doctorPatient/doctor-patient.service';

@Component({
  selector: 'app-examination',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './examination.component.html',
  styleUrls: ['./examination.component.css']
})
export class ExaminationComponent {
  activeTab: string = 'prescriptions';
  prescriptions: any[] = [];
  testResults: any[] = [];
  histories: any[] = [];
  reports: any[] = [];

  doctorId: number | null = null;
  appointmentId!: number;
  appointment: any;
  patient: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private appointmentService: AppointmentService,
    private prescriptionService: PrescriptionService,
    private testResultService: TestResultService,
    private patientHistoryService: PatientHistoryService,
    private patientReportService: PatientReportService,
    private userService: UserService,
    private doctorPatientService: DoctorPatientService
  ) {}

  ngOnInit(): void {
    console.log("🟡 ngOnInit çağrıldı");

    this.userService.getCurrentUser().subscribe({
      next: (user) => {
        this.doctorId = user.id;
        console.log("🧑‍⚕️ Giriş yapan doktor:", user);
      },
      complete: () => {
        this.route.paramMap.subscribe(params => {
          const idParam = params.get('id');
          this.appointmentId = idParam ? +idParam : NaN;

          if (!this.appointmentId || isNaN(this.appointmentId)) {
            alert('Geçersiz randevu ID!');
            this.router.navigate(['/doktor-dashboard']);
            return;
          }

          this.loadAppointment();
        });
      }
    });
  }

  loadAppointment(): void {
    console.log('📡 Randevu verisi çekiliyor...');

    this.appointmentService.getAppointmentById(this.appointmentId).subscribe({
      next: (res) => {
        this.appointment = res;
        this.patient = res.patient;
        console.log('✅ Randevu ve hasta verisi alındı:', this.appointment);
        console.log('🧑‍🤝‍🧑 Hasta ID:', this.patient?.id);
        this.checkIfDoctorOwnsPatient();
      },
      error: (err) => console.error('❌ Randevu alınamadı:', err)
    });
  }

  checkIfDoctorOwnsPatient(): void {
    if (!this.patient?.id || !this.doctorId) return;

    this.doctorPatientService.getMyPatients().subscribe({
      next: (myPatients) => {
        const isMine = myPatients.some(p => p.id === this.patient.id);
        if (isMine) {
          console.log('✅ Bu hasta bu doktorun hastası, veriler yüklenecek...');
          this.loadPatientData();
        } else {
          console.warn('❌ Bu hasta bu doktorun hastası değil. Veri çekilmeyecek.');
        }
      },
      error: (err) => {
        console.error('❌ Doktor hastaları alınamadı:', err);
      }
    });
  }

  loadPatientData(): void {
    if (!this.patient?.id || !this.doctorId) return;

    this.prescriptionService.getPrescriptionsByPatient(this.patient.id).subscribe({
      next: (res) => {
        this.prescriptions = res;
        console.log("💊 Reçeteler yüklendi:", res);
      },
      error: (err) => console.error("Reçeteler alınamadı:", err)
    });

    this.testResultService.getTestResultsByPatientId(this.patient.id).subscribe({
      next: (res) => {
        this.testResults = res;
        console.log("🧪 Test sonuçları yüklendi:", res);
      },
      error: (err) => console.error("Test sonuçları alınamadı:", err)
    });

    this.patientHistoryService.getHistoriesByPatientId(this.patient.id).subscribe({
      next: (res) => {
        this.histories = res;
        console.log("📚 Geçmişler yüklendi:", res);
      },
      error: (err) => console.error("Geçmişler alınamadı:", err)
    });

    this.patientReportService.getReportsByPatientId(this.patient.id).subscribe({
      next: (res) => {
        this.reports = res;
        console.log("📄 Raporlar yüklendi:", res);
      },
      error: (err) => console.error("Raporlar alınamadı:", err)
    });
  }

  goTo(path: string): void {
    if (this.patient?.id) {
      console.log('➡️ Yönlendirme yapılıyor:', path, 'hasta ID:', this.patient.id);
      this.router.navigate([`/${path}`], {
        queryParams: { patientId: this.patient.id }
      });
    }
  }
  markAppointmentCompleted(): void {
  if (!this.appointmentId) return;

  this.appointmentService.updateAppointmentStatus(this.appointmentId, 'COMPLETED').subscribe({
    next: () => {
      console.log('🟢 Randevu durumu COMPLETED olarak güncellendi.');
      this.appointment.status = 'COMPLETED'; // localde de güncelle
      alert('Randevu başarıyla tamamlandı.');
    },
    error: (err) => {
      console.error('❌ Randevu durumu güncellenemedi:', err);
      alert('Randevu durumu güncellenemedi!');
    }
  });
}

}
