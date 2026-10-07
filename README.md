# Rafi Cinema

## Menjalankan (dengan sinkronisasi akun antar perangkat)

```
npm start          # atau: node server/index.js
```

Buka http://localhost:3000. Butuh Node.js 18+, tanpa instal paket tambahan.

- Akun, profil (bio, foto, dll.), Daftar Saya (like), dan paket membership disimpan di server
  (`server/data/db.json`), jadi login di perangkat mana pun menampilkan data yang sama.
  Perubahan di satu perangkat muncul di perangkat lain dalam ~10 detik (atau langsung saat tab dibuka lagi).
- Password disimpan sebagai hash (scrypt), sesi memakai cookie HttpOnly.
- Pengaturan Display (tema, mode Mobile/Desktop) sengaja tetap per perangkat.

## Deploy
Unggah ke hosting yang menjalankan Node.js (VPS, Railway, Render, dll.) dengan perintah start `npm start`.
Hosting statis (GitHub Pages, Netlify tanpa fungsi) TIDAK bisa menyimpan akun bersama; di sana situs otomatis
memakai mode lokal (data hanya di browser itu).

Penting:
- Simpan folder `server/data` di disk yang permanen (volume). Di hosting gratis yang disknya sementara, data akun hilang saat restart.
  Lokasi file bisa diubah dengan env `DATA_FILE=/path/db.json`.
- Akun pemilik (centang biru) adalah email `rafiabdlhfzh@gmail.com`. Agar tidak ada orang lain yang mendaftar
  dengan email itu lebih dulu, set env `OWNER_PASSWORD` (min. 8 karakter) sebelum start pertama, atau daftar sendiri
  segera setelah deploy.
- Pakai HTTPS di produksi (cookie otomatis `Secure` bila diakses lewat HTTPS).
