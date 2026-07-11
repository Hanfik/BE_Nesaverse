# NesaVerse API Testing Guide 🚀

Dokumen ini berisi panduan untuk melakukan pengetesan seluruh route backend NesaVerse yang telah dideploy di Vercel maupun yang dijalankan secara lokal menggunakan **Postman**.

Dua file konfigurasi telah dibuat di folder `backend/`:
1. `NesaVerse_API_Testing.postman_collection.json` (Koleksi API & Test Assertions)
2. `NesaVerse_Environment.postman_environment.json` (Variabel Environment)

---

## 🛠️ Cara Impor ke Postman

1. Buka aplikasi **Postman**.
2. Klik tombol **Import** di pojok kiri atas (atau drag-and-drop file).
3. Pilih file `NesaVerse_API_Testing.postman_collection.json` dan `NesaVerse_Environment.postman_environment.json` sekaligus.
4. Klik **Import**.

---

## 🌐 Mengatur Environment (Vercel vs Lokal)

Di pojok kanan atas Postman, pilih environment **NesaVerse Environments**. Anda dapat melihat dan mengedit variabel:
- **`baseUrl`**: Arahkan ke backend Vercel (`https://be-nesaverse.vercel.app/api`).
- **`localUrl`**: Arahkan ke backend lokal Anda (`http://localhost:5001/api`).

> **Tips**: Jika ingin melakukan test pada server lokal, Anda bisa mengganti URL di request atau memperbarui nilai `baseUrl` di environment dengan isi `localUrl`.

---

## 📋 Struktur Route yang Ditest

Koleksi ini dibagi menjadi beberapa folder terstruktur:

### 1. General & Health
- **GET** `{{baseUrl}}/health` — Memastikan backend Vercel online & merespon dengan status `ok`.
- **GET** `{{baseUrl}}/stats` — Memastikan statistik dashboard NesaVerse berhasil dimuat.

### 2. Communities & Servers
- **GET** `{{baseUrl}}/communities` — Mengambil daftar komunitas aktif.
- **GET** `{{baseUrl}}/servers` — Mengambil daftar server.
- **GET** `{{baseUrl}}/channels` — Mengambil daftar channel.

### 3. Donations
- **GET** `{{baseUrl}}/donations` — Mengambil riwayat donasi terbaru.
- **GET** `{{baseUrl}}/donations/top` — Mengambil daftar top donator.
- **POST** `{{baseUrl}}/donations` — Menguji pembuatan donasi baru dengan payload JSON.

### 4. YouTube, TikTok, Instagram & Roblox Hubs (CRUD Lengkap)
Setiap folder hub sosial media memiliki pengetesan CRUD lengkap:
1. **GET List** — Memuat seluruh data hub terkait.
2. **POST (Create)** — Membuat entri data baru.
3. **PUT (Update)** — Mengedit entri data yang baru saja dibuat.
4. **DELETE** — Menghapus data tersebut agar database tetap bersih.

---

## ⚡ Fitur Automated & Dynamic Testing (Chaining)

Koleksi ini dirancang agar **sepenuhnya otomatis**. Anda tidak perlu menyalin ID secara manual untuk melakukan update/delete.

### Bagaimana cara kerjanya?
1. Saat Anda menjalankan request **POST (Create)**, Postman Test Script otomatis menangkap ID data yang baru dibuat:
   ```javascript
   var jsonData = pm.response.json();
   pm.collectionVariables.set("createdYouTubeId", jsonData.id);
   ```
2. Request **PUT** dan **DELETE** berikutnya menggunakan variabel dinamis tersebut pada URL-nya (misalnya: `{{baseUrl}}/youtube/{{createdYouTubeId}}`).
3. Setelah didelete, database Anda akan tetap bersih tanpa menyisakan data sampah bekas testing.

---

## 🧪 Cara Menjalankan Semua Test Sekaligus (Runner)

1. Arahkan kursor ke koleksi **NesaVerse API Testing** di panel sebelah kiri Postman.
2. Klik ikon titik tiga `...` di sebelah nama koleksi.
3. Pilih **Run Collection**.
4. Pastikan semua request tercentang dan urutannya benar (terutama Create -> Update -> Delete).
5. Klik **Run NesaVerse API Testing**.
6. Anda akan melihat laporan hijau (PASS) yang mengonfirmasi seluruh endpoint berjalan dengan baik!
