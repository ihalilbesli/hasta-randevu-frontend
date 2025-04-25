import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './welcome.component.html',
  styleUrl: './welcome.component.css'
})
export class WelcomeComponent {
  currentSlide = 0;

  slides = [
    {
      title: 'Yapay Zeka Destekli Randevu Sistemi',
      description: 'Şikayetlerinizi analiz ederek en uygun polikliniği öneriyoruz.',
      imageUrl: 'assets/slider/ai-support.jpg'
    },
    {
      title: 'Tek Tıkla Randevu',
      description: 'Mobil ve web platformlarından kolayca randevu alın.',
      imageUrl: 'assets/slider/quick-appointment.jpg'
    },
    {
      title: 'Uzman Doktorlara Ulaşın',
      description: 'Alanında uzman doktorlarla güvenli sağlık hizmeti.',
      imageUrl: 'assets/slider/find-doctor.jpg'
    }
  ];

  constructor(private router: Router) {
    setInterval(() => this.nextSlide(), 4000);
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }

  goToRegister() {
    this.router.navigate(['/register']);
  }

  goToSlide(index: number) {
    this.currentSlide = index;
  }

  nextSlide() {
    this.currentSlide = (this.currentSlide + 1) % this.slides.length;
  }

  prevSlide() {
    this.currentSlide = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
  }
}
