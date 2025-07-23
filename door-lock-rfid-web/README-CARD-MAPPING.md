# Cara Mengubah ID Card RFID Menjadi Nama di Firebase

## Overview
Sistem ini memungkinkan Anda untuk mengubah tampilan ID card RFID menjadi nama pengguna di log akses dashboard monitoring ruangan. **Manajemen kartu dilakukan melalui halaman terpisah**, sedangkan dashboard hanya menampilkan hasil konversi.

## Struktur Database Firebase

### 1. Struktur Data Kartu Mapping
```
/card_mapping/
├── 5e487e00: "Pak syukri"
├── 9abc7900: "Pak syam"
├── d4a71e85: "Ibu Kartika"
└── 6da3341f: "Pak Rijal"
```

### 2. Struktur Data Log Akses (Existing)
```
/ruangan_name/
└── access_history/
    └── access_records/
        ├── timestamp: "2024-01-01T10:00:00"
        ├── card_id: "5e487e00"
        └── status: "granted"
```

## Cara Menggunakan

### Langkah 1: Setup Awal
1. Buka file `init-cards.html` di browser
2. Klik tombol "Inisialisasi Data Awal" untuk membuat struktur data awal
3. Atau gunakan tombol "Tambah Kartu" untuk menambah kartu satu per satu

### Langkah 2: Menambah Kartu Baru
1. Masukkan ID kartu RFID di field "ID Kartu RFID"
2. Masukkan nama pengguna di field "Nama Pengguna"
3. Klik "Tambah Kartu"

### Langkah 3: Menggunakan Dashboard
1. Login ke dashboard (`dashboard.html`)
2. Log akses akan otomatis menampilkan nama pengguna instead of ID kartu
3. Manajemen kartu dilakukan melalui `init-cards.html`

## Fitur yang Tersedia

### 1. Mapping Otomatis di Dashboard
- ID card RFID akan otomatis ditampilkan sebagai nama pengguna
- Jika kartu belum terdaftar, akan ditampilkan sebagai "ID: [card_id]"
- **Tidak ada interface manajemen kartu di dashboard**

### 2. Manajemen Kartu via Halaman Terpisah
- Tambah kartu baru melalui `init-cards.html`
- Hapus kartu yang tidak digunakan
- Lihat semua kartu terdaftar
- Console untuk monitoring operasi

### 3. Real-time Sync
- Perubahan di `init-cards.html` langsung terlihat di dashboard
- Tidak perlu refresh halaman dashboard

## File yang Dimodifikasi

### 1. `dashboard.js`
- Menambahkan referensi ke `/card_mapping` di Firebase
- Fungsi `getNameFromCardId()` untuk konversi ID ke nama
- Fungsi `addCardMapping()` dan `removeCardMapping()` (untuk console)
- Update fungsi `renderAccessLog()` untuk menampilkan nama
- **Tidak ada interface manajemen kartu**

### 2. `dashboard.html`
- **Tidak ada section "Manajemen Kartu RFID"**
- Hanya menampilkan log akses dengan nama pengguna
- Interface yang lebih bersih dan fokus

### 3. `init-card-mapping.js` (Baru)
- Script untuk inisialisasi data mapping
- Fungsi untuk menambah kartu ke Firebase
- Fungsi untuk melihat semua kartu terdaftar

### 4. `init-cards.html` (Baru)
- Halaman untuk setup awal mapping kartu
- Interface yang user-friendly untuk manajemen kartu
- Console untuk monitoring operasi

## Cara Kerja Sistem

### 1. Real-time Sync
```javascript
// Mendengarkan perubahan di Firebase
cardMappingRef.on('value', (snapshot) => {
  cardIdToName = snapshot.val() || {};
  renderAccessLog(roomsData); // Refresh log
});
```

### 2. Konversi ID ke Nama
```javascript
function getNameFromCardId(cardId) {
  return cardIdToName[cardId] || `ID: ${cardId}`;
}
```

### 3. Update Log Akses
```javascript
const userName = getNameFromCardId(log.card_id || 'N/A');
const activity = `${statusText} (${userName})`;
```

## Workflow Penggunaan

### Untuk Admin/Operator:
1. **Setup awal**: Buka `init-cards.html` dan tambah kartu
2. **Monitoring**: Buka `dashboard.html` untuk melihat log akses
3. **Manajemen**: Kembali ke `init-cards.html` jika perlu tambah/hapus kartu

### Untuk User:
1. **Akses**: Scan kartu RFID seperti biasa
2. **Monitoring**: Log akan menampilkan nama instead of ID

## Keuntungan Desain Ini

### 1. **Dashboard yang Bersih**
- Fokus pada monitoring dan log akses
- Tidak ada clutter interface manajemen
- Lebih mudah digunakan untuk monitoring harian

### 2. **Manajemen Terpisah**
- Interface manajemen kartu yang dedicated
- Lebih banyak fitur untuk admin
- Console untuk debugging dan monitoring

### 3. **Keamanan**
- Manajemen kartu terpisah dari dashboard utama
- Bisa dibatasi akses ke `init-cards.html`
- Dashboard tetap berfungsi meski manajemen kartu tidak tersedia

## Troubleshooting

### 1. Kartu Tidak Muncul
- Pastikan ID kartu sudah ditambahkan via `init-cards.html`
- Cek console browser untuk error
- Pastikan koneksi Firebase berfungsi

### 2. Nama Tidak Berubah
- Refresh halaman dashboard
- Cek apakah mapping sudah tersimpan di Firebase
- Pastikan format ID kartu sesuai

### 3. Error Firebase
- Cek koneksi internet
- Pastikan Firebase config benar
- Cek rules Firebase database

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka dashboard untuk melihat hasil

### Melihat Semua Kartu
1. Buka `init-cards.html`
2. Klik "Lihat Semua Kartu"
3. Lihat daftar di console

### Monitoring di Dashboard
1. Buka `dashboard.html`
2. Scroll ke "Log Akses"
3. Lihat nama pengguna di kolom aktivitas

## Support

Jika mengalami masalah:
1. Cek console browser untuk error
2. Pastikan semua file ter-load dengan benar
3. Verifikasi koneksi Firebase
4. Cek rules Firebase database
5. Gunakan `init-cards.html` untuk debugging 

## Contoh Penggunaan

### Menambah Kartu via init-cards.html
1. Buka `init-cards.html`
2. Masukkan ID kartu dan nama
3. Klik "Tambah Kartu"
4. Buka