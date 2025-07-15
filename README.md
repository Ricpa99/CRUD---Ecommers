# CRUD-Ecommers

#### 🔍 Ringkasan Proyek
CRUD-Ecommers adalah sebuah proyek aplikasi e-commerce dasar yang berfokus pada fungsionalitas CRUD (Create, Read, Update, Delete) untuk manajemen produk dan kategori. Proyek ini dibangun menggunakan Laravel 10/11 sebagai backend yang kuat dan efisien.

Yang membedakan proyek ini adalah penggunaan Laravel Breeze untuk sistem otentikasi, yang diintegrasikan secara mulus dengan React.js sebagai frontend untuk antarmuka pengguna yang dinamis dan interaktif. Untuk styling, proyek ini memanfaatkan Tailwind CSS, memungkinkan pengembangan antarmuka yang cepat dan responsif. Lingkungan database lokal diatur melalui XAMPP, yang menyediakan MySQL sebagai database dan Apache sebagai web server.

Proyek ini bertujuan untuk mendemonstrasikan bagaimana teknologi full-stack modern dapat digabungkan untuk membangun aplikasi e-commerce yang fungsional dan responsif
Dillinger is a cloud-enabled, mobile-ready, offline-storage compatible,
AngularJS-powered HTML5 Markdown editor.

### ✨ Fitur Utama
Proyek ini menyediakan fitur-fitur dasar e-commerce yang interaktif, memanfaatkan kombinasi Laravel, React.js, dan Tailwind CSS:

Manajemen Produk (CRUD)
- Buat (Create): Menambahkan produk baru (nama, deskripsi, harga, gambar, kategori, dll.) melalui formulir React yang berinteraksi dengan API Laravel.
- Baca (Read): Menampilkan daftar produk dan detail produk dengan tampilan yang dinamis dan responsif.
- Perbarui (Update): Mengedit informasi produk yang sudah ada melalui antarmuka React.

Manajemen Kategori (CRUD)
- Kemampuan untuk melihat data product berdasarkan kategori

Sistem Otentikasi (Laravel Breeze)
- Login & Registrasi: Fungsionalitas login dan registrasi pengguna/admin.
- Dashboard Terlindungi: Area dashboard yang hanya dapat diakses setelah otentikasi.

Tampilan Produk Interaktif
- Pengguna dapat menelusuri produk dengan filtering atau sorting yang responsif menggunakan tailwindcss dan react.js.

### 🚀 Teknologi yang Digunakan
Backend:
- Laravel Framework (11): Kerangka kerja PHP untuk logika dan manajemen database.
- PHP: Bahasa pemrograman inti.
- MySQL: Sistem manajemen database (disediakan oleh XAMPP).

Frontend:
- React.js: Pustaka JavaScript untuk membangun antarmuka pengguna yang dinamis.
- Tailwind CSS: Framework CSS berbasis utilitas untuk styling yang cepat dan responsif.
- Laravel Breeze: Paket otentikasi Laravel dengan scaffolding React.

Lingkungan Pengembangan:
- XAMPP: Lingkungan pengembangan cross-platform (Apache, MySQL, PHP, Perl).

### Struktur Proyek
Struktur direktori proyek mengikuti standar Laravel, dengan penambahan khusus untuk integrasi React.js dan Tailwind CSS:
```
├── app/                  # Logika inti aplikasi (Models, Controllers, Providers)
├── bootstrap/            # File bootstrapping Laravel
├── config/               # File konfigurasi aplikasi
├── database/             # Migrasi database, seeder, factory
├── public/               # Direktori root web (aset publik, index.php)
├── resources/
│   ├── js/               # **Direktori utama untuk komponen React.js**
│   │   ├── Components/   # Komponen React yang dapat digunakan kembali
│   │   ├── Layouts/      # Layout React
│   │   └── Pages/        # Halaman React (misal: Auth, ProductList)
│   ├── css/
│   │   └── app.css       # File CSS utama (deklarasi @tailwind)
│   └── views/            # Tampilan Blade Laravel (wadah untuk aplikasi React)
├── routes/               # Definisi rute aplikasi (web, api, console)
├── storage/              # File yang dihasilkan Laravel (log, cache, unggahan)
├── vendor/               # Dependensi Composer
├── node_modules/         # Dependensi Node.js (React, Tailwind, dll.)
├── .env                  # File konfigurasi lingkungan
├── composer.json         # Dependensi PHP
├── package.json          # Dependensi Node.js
└── README.md             # File ini
```

### 🔧 Instalasi dan Penggunaan
Ikuti langkah-langkah di bawah ini untuk menjalankan proyek ini di lingkungan lokal Anda:
#### 1. Persyaratan Sistem
- XAMPP: Pastikan Apache dan MySQL berjalan.
- PHP: Versi 8.x (sesuai dengan Laravel 10/11).
- Composer: Manajer paket PHP.
- Node.js & npm/Yarn: Untuk mengelola dependensi JavaScript.

### 2. Kloning Repositori
```sh
git clone https://github.com/Ricpa99/CRUD-Ecommers.git
cd CRUD-Ecommers
```

### 3. Konfigurasi Backend (Laravel)
- Instal Dependensi Composer:
```sh
composer install
```
- Salin File Lingkungan:
```sh
 cp .env.example .env
```
- Buat Kunci Aplikasi:
```sh
php artisan key:generate
```
- Konfigurasi Database (.env):
Buka file .env dan sesuaikan pengaturan database Anda. Contoh untuk XAMPP:
```sh
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=nama_database_anda # Ganti dengan nama database yang Anda buat
DB_USERNAME=root
DB_PASSWORD=
```
- Jalankan Migrasi Database:
```sh
php artisan migrate
```

_Opsional: Jika Anda memiliki seeder untuk data awal, jalankan:_
```sh
php artisan db:seed
```
- Jalankan Server Laravel:
```sh
php artisan serve
```

### 4. Konfigurasi Frontend (React.js & Tailwind CSS)
- Instal Dependensi Node.js:
```sh
npm install # atau yarn install
```
- Kompilasi Aset Frontend:
```sh
npm run dev # atau yarn dev (untuk pengembangan dengan hot-reloading)
# atau npm run build (untuk produksi)
```
Ini akan mengkompilasi komponen React dan aset Tailwind CSS Anda.

### 5. Akses Aplikasi
Buka browser Anda dan kunjungi URL yang dihasilkan oleh php artisan serve (biasanya http://127.0.0.1:8000). Anda akan melihat aplikasi e-commerce Anda berjalan dengan frontend React.js dan styling Tailwind CSS.
