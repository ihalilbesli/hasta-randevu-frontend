import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ClinicsService } from '../../../service/clinics/clinics.service';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from "../../header/header.component";

@Component({
  selector: 'app-admin-clinics',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-clinics.component.html',
  styleUrl: './admin-clinics.component.css'
})
export class AdminClinicsComponent {

   clinics: any[] = [];
  selectedClinic: any = null;

  name: string = '';
  description: string = '';

  constructor(private clinicService: ClinicsService) {}

  ngOnInit(): void {
    this.loadClinics();
  }

  loadClinics() {
    this.clinicService.getAllClinics().subscribe(data => {
      this.clinics = data;
    });
  }

  onSubmit() {
    const clinicData = {
      name: this.name,
      description: this.description
    };

    if (this.selectedClinic) {
      this.clinicService.updateClinic(this.selectedClinic.id, clinicData).subscribe(() => {
        this.loadClinics();
        this.resetForm();
      });
    } else {
      this.clinicService.createClinic(clinicData).subscribe(() => {
        this.loadClinics();
        this.resetForm();
      });
    }
  }

  editClinic(clinic: any) {
    this.selectedClinic = clinic;
    this.name = clinic.name;
    this.description = clinic.description;
  }

  deactivateClinic(id: number) {
    this.clinicService.deactivateClinic(id).subscribe(() => {
      this.loadClinics();
    });
  }

  activateClinic(id: number) {
    this.clinicService.activateClinic(id).subscribe(() => {
      this.loadClinics();
    });
  }

  resetForm() {
    this.selectedClinic = null;
    this.name = '';
    this.description = '';
  }
}
