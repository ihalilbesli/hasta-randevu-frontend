# 🌐 Yapay Zeka Destekli Hasta Randevu Sistemi – Frontend

Bu proje, yapay zeka destekli hasta randevu sisteminin **Angular** ile geliştirilmiş frontend (kullanıcı arayüzü) uygulamasıdır. Sistem; **Hasta**, **Doktor** ve **Admin** olmak üzere üç farklı kullanıcı rolüne göre özelleştirilmiş paneller içerir.

Kullanıcılar, sisteme giriş yaptıktan sonra kendi rollerine özel işlemleri gerçekleştirebilirler. Randevu alma, reçete görüntüleme, geçmiş kayıtlar, istatistikler ve şikayet bildirme gibi birçok işlem kullanıcı dostu bir arayüz üzerinden sağlanmaktadır.

Proje, modern frontend mimarisi, güvenli yönlendirme yapısı (guard’lar), servis tabanlı API entegrasyonu ve responsive tasarımı ile geliştirilmiştir.

## ⚙️ Sistem Özellikleri ve Roller

Frontend tarafı, üç ana kullanıcı tipi için farklı paneller ve özellikler sunar:

---

### 👤 Hasta Paneli

- Giriş yaptıktan sonra **randevu oluşturma ekranına** erişir.
  - Poliklinik → Doktor → Tarih → Saat adımlarıyla klasik yöntemle randevu oluşturabilir.
  - Alternatif olarak, **şikayet metni girerek** yapay zekanın sunduğu poliklinik önerisiyle randevu alabilir.
- **Randevularım** sayfasından geçmiş ve aktif randevularını filtreleyebilir.
- **Reçetelerim**, **Test Sonuçlarım**, **Hasta Geçmişim**, **Raporlarım** ekranlarından doktorların kendisi için oluşturduğu verileri görüntüleyebilir.
- **Profilim** sayfasından kendi bilgilerini güncelleyebilir.
- **Nöbetçi Eczane Bilgileri** ekranından güncel eczane verilerine ulaşabilir (CollectAPI üzerinden).

---

### 🩺 Doktor Paneli

- Sistemde kendisine ait olan randevuları görüntüleyebilir.
- Randevu detaylarından ilgili hastaya ait geçmiş verilere erişebilir.
- Her hasta için yeni:
  - **Reçete**
  - **Test Sonucu**
  - **Hasta Geçmişi**
  - **Hasta Raporu**
  oluşturabilir.
- Bugün gelen hastaların listesine erişebilir.
- Kendi **profil bilgilerini güncelleyebilir**.

> 🔒 Doktorlar sistem istatistiklerini görüntüleyemez. Bu özellik sadece admin kullanıcıya özeldir.

---

### 🛡️ Admin Paneli

- **Tüm kullanıcıları** listeleyebilir, kullanıcı oluşturabilir ve kullanıcı bilgilerini güncelleyebilir.
- **Tüm şikayetleri** filtreleyip görüntüleyebilir, durum güncelleyebilir.
- **Tüm randevuları**, **test sonuçlarını**, **reçeteleri**, **geçmiş kayıtları** ve **raporları** görebilir.
- **İstatistiksel verileri grafiklerle** görüntüleyebilir.
- Grafikler üzerinden **yapay zeka desteğiyle analiz/yorum** alabilir (örneğin: “Hangi poliklinikte yoğunluk var?”, “Şikayet türü dağılımı nasıl?” vb.)
- Sistem davranışı hakkında **AI ile sistem analizi** başlatabilir.
- Admin de kendi profil bilgilerini düzenleyebilir.

---


## 🧰 Kullanılan Teknolojiler

<p align="left">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/angularjs/angularjs-original.svg" width="40"/>
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg" width="40"/>
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" width="40"/>
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg" width="40"/>
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg" width="40"/>
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/npm/npm-original-wordmark.svg" width="40"/>
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg" width="40"/>
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg" width="40"/>
</p>


### 🌐 Frontend

- **Angular 17** – Bileşen tabanlı modern frontend framework
- **TypeScript** – Tip güvenliği ve daha temiz JS kod yapısı
- **RxJS** – Reactive programlama ile veri akışı yönetimi
- **Angular Router** – Sayfa yönlendirme ve guard yapılandırmaları
- **Angular Service** – API çağrıları ve veri işlemleri için katmanlı yapı
- **Standalone Component Mimarisi** – Daha modüler ve sade bileşen yapısı
- **Custom CSS** – Responsive ve modern tasarım stilleri
- **Ngx-Toastr** – Hata ve başarı mesajlarını göstermek için bildirim sistemi
- **Font Awesome & Lucide Icons** – Zengin ikon kullanımı
- **NgIf, NgFor, NgClass** – Angular direktifleri ile dinamik yapı
- **LocalStorage** – JWT token ve kullanıcı bilgisi saklama

---
## 📦 Kurulum ve Çalıştırma (Frontend – Angular)

Bu adımları takip ederek projeyi eksiksiz şekilde kurabilir ve yerel ortamda çalıştırabilirsiniz.  
Proje Angular 17, TypeScript ve Tailwind CSS ile geliştirilmiştir.

---

### 1️⃣ Gerekli Araçları Kurun

Aşağıdaki araçların sisteminizde yüklü olduğundan emin olun:

- **Node.js (v18+ önerilir)**  
  [Node.js indirme sayfası](https://nodejs.org)

- **Angular CLI (v17)**  
  Kurmak için terminalde şu komutu çalıştırın:

  ```bash
  npm install -g @angular/cli
  ```

- **Git (versiyon kontrol için)**  
  [Git indirme sayfası](https://git-scm.com/)

- **VS Code veya benzeri bir kod editörü**

---

### 2️⃣ Projeyi Klonlayın

GitHub üzerinden frontend reposunu bilgisayarınıza çekin:

```bash
git clone https://github.com/ihalilbesli/hastaneRandevu-frontend.git
cd hastaneRandevu-frontend
```

---

### 3️⃣ Bağımlılıkları Yükleyin

Projede kullanılan tüm Angular modüllerini indirmek için:

```bash
npm install
```

Bu işlem aşağıdaki temel kütüphaneleri ve bağımlılıkları indirir:

- `@angular/core`, `@angular/forms`, `@angular/router`
- `rxjs` – reactive veri yönetimi
- `ngx-toastr` – bildirim sistemi
- `lucide-angular`, `@fortawesome/angular-fontawesome` – ikonlar
- `tailwindcss`, `autoprefixer`, `postcss` – stil altyapısı
- `@angular/animations` – Toastr için gereklidir!

Eğer Toastr çalışmazsa şu komutla tekrar kurabilirsiniz:

```bash
npm install ngx-toastr @angular/animations
```

---

### 4️⃣ Tailwind CSS'i Yapılandırın (Zaten hazır)

Tailwind CSS projenin içinde zaten yapılandırılmıştır.  
`tailwind.config.js` ve `styles.css` içinde gerekli ayarlar mevcuttur.

Kod içinde doğrudan:

```html
<div class="bg-blue-500 text-white p-4 rounded-lg">Merhaba!</div>
```

gibi Tailwind sınıfları kullanılmıştır.

---

### 5️⃣ API Bağlantı Ayarını Yapın

Backend’e istek atılacak adresi tanımlamak için:  
`src/environments/environment.ts` dosyasını açın ve şu şekilde düzenleyin:

```ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/hastarandevu'
};
```

> Not: Eğer backend’i canlıya aldıysanız bu URL’yi güncelleyin.

---

### 6️⃣ Uygulamayı Başlatın

Angular geliştirme sunucusunu çalıştırmak için:

```bash
ng serve
```

veya

```bash
npm start
```

Tarayıcıda otomatik olarak açılmazsa şu adrese gidin:  
🌐 `http://localhost:4200`

---

### 🔐 Test Kullanıcı Girişi

Eğer backend aktifse, örnek giriş bilgileriyle test edebilirsiniz:

```json
{
  "email": "admin@example.com",
  "password": "1234"
}
```
---

### ⚠️ Olası Sorunlar ve Çözümler

- `Module not found` hatası alırsanız:  
  → `npm install` komutunu tekrar çalıştırın.

- Toastr görünmüyorsa:  
  → `@angular/animations` kurulu ve `AppModule` içinde `BrowserAnimationsModule` tanımlı mı kontrol edin.

---

✅ Artık sisteminizde frontend başarıyla kurulmuş ve çalışıyor olmalı!

## 📁 Frontend Proje Dosya Yapısı

Angular projenin temel klasör ve dosyaları aşağıdaki gibidir:

```
src/
└── app/
    ├── components/             # Kullanıcı rollerine göre alt bileşenler
    │   ├── admin/             # Yönetici paneli bileşenleri
    │   ├── auth/              # Giriş, kayıt, şifre sıfırlama bileşenleri
    │   ├── doktor/            # Doktor paneli bileşenleri
    │   ├── hasta/             # Hasta paneli bileşenleri
    │   ├── header/            # Genel header/navigation bileşenleri
    │   └── welcome/           # Hoşgeldin ve ana sayfa bileşenleri

    ├── guards/                # Route koruma ve yetkilendirme guard'ları
    ├── service/               # API çağrıları ve iş mantığı servisleri
    ├── app.component.html     # Ana component HTML yapısı
    ├── app.component.ts       # Ana component TypeScript dosyası
    ├── app.component.css      # Ana component CSS dosyası
    ├── app.routes.ts          # Uygulama yönlendirme (routing) tanımları
    └── app.config.ts          # Uygulama genel ayarları ve sabitler

assets/                       # Statik dosyalar (resimler, ikonlar, vs.)
index.html                    # Projenin HTML giriş dosyası
main.ts                       # Angular uygulamasının başlatıldığı ana dosya
styles.css                    # Global stil dosyası
angular.json                  # Angular CLI yapılandırma dosyası
package.json                  # Proje bağımlılıkları ve betikleri
tsconfig.json                 # TypeScript yapılandırma dosyası
```

---

### Kısaca Klasörlerin Görevleri

- **components/**: Uygulamanın tüm kullanıcı arayüzü bileşenleri burada gruplanmıştır.  
- **guards/**: Rota koruma ve rol bazlı erişim kontrolü için Angular Guard sınıfları.  
- **service/**: API ile iletişim ve uygulama içi iş mantığı bu klasörde.  
- **app.routes.ts**: Tüm sayfa rotaları ve ilgili guard'lar burada tanımlıdır.  
- **assets/**: Resim, logo, font gibi statik dosyalar.

---

✅ Bu yapı, projede kolay yönetim ve modülerlik sağlar. Özellikle büyük projelerde komponent ve servislerin rolüne göre ayrılması, kodun okunabilirliğini ve sürdürülebilirliğini artırır.

## 🛣️ Angular Routing ve Guard Yapısı

Projede kullanıcıların sayfalara erişimi, rol ve giriş durumuna göre güvence altına alınmıştır. Bunun için iki temel guard mekanizması kullanılmıştır:

- **AuthGuard**: Kullanıcının sisteme giriş yapıp yapmadığını kontrol eder. Eğer giriş yoksa kullanıcı otomatik olarak giriş sayfasına yönlendirilir.
- **RoleGuard**: Kullanıcının rolünü kontrol eder ve sadece izin verilen rollerin erişmesine izin verir. Yetkisiz erişimlerde kullanıcı karşılama sayfasına yönlendirilir.

### Örnek Route Yapısı

```typescript
const routes = [
  { path: '', redirectTo: 'welcome', pathMatch: 'full' },
  { path: 'welcome', component: WelcomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  // Hasta rolleri için korumalı sayfalar
  {
    path: 'hasta-dashboard',
    component: HastaDashboardComponent,
    canActivate: [authGuard, roleGuard(['HASTA'])]
  },

  // Doktor rolleri için korumalı sayfalar
  {
    path: 'doktor-dashboard',
    component: DoktorDashboardComponent,
    canActivate: [authGuard, roleGuard(['DOKTOR'])]
  },

  // Admin rolleri için korumalı sayfalar (Sidebar ve Layout dahil)
  {
    path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [authGuard, roleGuard(['ADMIN'])],
    children: [
      { path: 'dashboard', component: AdminDashboardComponent },
      { path: 'users', component: AdminUserListComponent },
      // diğer admin sayfaları
    ]
  },

  // Tüm giriş yapmış kullanıcılar için profil sayfası
  {
    path: 'profil',
    component: ProfilComponent,
    canActivate: [authGuard]
  }
];




