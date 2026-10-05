/* Penjaga halaman: jalankan di <head>. Kalau belum login, sembunyikan halaman
   (supaya tidak berkedip) lalu langsung arahkan ke login.html. */
(function () {
    var ok = false;
    try { ok = !!localStorage.getItem('rafi-cinema-session'); } catch (e) {}
    if (!ok) {
        document.documentElement.style.display = 'none';
        location.replace('login.html');
    }
}());
