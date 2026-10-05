/* Penjaga halaman: jalankan di <head>. Kalau belum login, langsung arahkan ke login.html. */
(function () {
    var ok = false;
    try { ok = !!localStorage.getItem('rafi-cinema-session'); } catch (e) {}
    if (!ok) location.replace('login.html');
}());
