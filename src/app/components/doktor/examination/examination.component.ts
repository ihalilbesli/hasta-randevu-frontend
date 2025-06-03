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
import { ToastrService } from 'ngx-toastr';

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
    private doctorPatientService: DoctorPatientService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.userService.getCurrentUser().subscribe({
      next: (user) => {
        this.doctorId = user.id;
      },
      complete: () => {
        this.route.paramMap.subscribe(params => {
          const idParam = params.get('id');
          this.appointmentId = idParam ? +idParam : NaN;

          if (!this.appointmentId || isNaN(this.appointmentId)) {
            this.toastr.warning('Geçersiz randevu ID!');
            this.router.navigate(['/doktor-dashboard']);
            return;
          }

          this.loadAppointment();
        });
      }
    });
  }

  loadAppointment(): void {
    this.appointmentService.getAppointmentById(this.appointmentId).subscribe({
      next: (res) => {
        this.appointment = res;
        this.patient = res.patient;
        this.checkIfDoctorOwnsPatient();
      },
      error: () => this.toastr.error('Randevu bilgisi alınamadı.')
    });
  }

  checkIfDoctorOwnsPatient(): void {
    if (!this.patient?.id || !this.doctorId) return;

    this.doctorPatientService.getMyPatients().subscribe({
      next: (myPatients) => {
        const isMine = myPatients.some(p => p.id === this.patient.id);
        if (isMine) {
          this.loadPatientData();
        } else {
          this.toastr.warning('Bu hasta size ait görünmüyor.');
        }
      },
      error: () => this.toastr.error('Doktorun hastaları alınamadı.')
    });
  }

  loadPatientData(): void {
    if (!this.patient?.id) return;

    this.prescriptionService.getPrescriptionsByPatient(this.patient.id).subscribe({
      next: (res) => this.prescriptions = res,
      error: () => this.toastr.error('Reçeteler alınamadı.')
    });

    this.testResultService.getTestResultsByPatientId(this.patient.id).subscribe({
      next: (res) => this.testResults = res,
      error: () => this.toastr.error('Test sonuçları alınamadı.')
    });

    this.patientHistoryService.getHistoriesByPatientId(this.patient.id).subscribe({
      next: (res) => this.histories = res,
      error: () => this.toastr.error('Hasta geçmişi alınamadı.')
    });

    this.patientReportService.getReportsByPatientId(this.patient.id).subscribe({
      next: (res) => this.reports = res,
      error: () => this.toastr.error('Hasta raporları alınamadı.')
    });
  }

  goTo(path: string): void {
    if (this.patient?.id) {
      this.router.navigate([`/${path}`], {
        queryParams: { patientId: this.patient.id }
      });
    }
  }

  markAppointmentCompleted(): void {
    if (!this.appointmentId) return;

    this.appointmentService.updateAppointmentStatus(this.appointmentId, 'COMPLETED').subscribe({
      next: () => {
        this.appointment.status = 'COMPLETED';
        this.toastr.success('Randevu başarıyla tamamlandı.');
      },
      error: () => {
        this.toastr.error('Randevu durumu güncellenemedi.');
      }
    });
  }
}
