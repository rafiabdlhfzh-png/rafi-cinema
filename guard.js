/* Penjaga halaman: jalankan di <head>. Saat link dibuka, langsung masuk sebagai akun pemilik
   (rafiabdlhfzh@gmail.com), kecuali pengguna sudah menekan Logout. */
(function () {
    var OWNER = 'rafiabdlhfzh@gmail.com', ok = false;
    try {
        ok = !!localStorage.getItem('rafi-cinema-session');
        if (!ok && !localStorage.getItem('rafi-cinema-loggedout')) {
            var m = {};
            try { m = (JSON.parse(localStorage.getItem('rafi-cinema-members')) || {})[OWNER] || {}; } catch (e) {}
            localStorage.setItem('rafi-cinema-session', JSON.stringify({ nama: m.nama || 'Rafi Abdul Hafizh', email: OWNER, plan: m.plan || null, price: m.price || null, bayar: m.bayar || null, since: m.since || '2026-10-05T00:00:00.000Z' }));
            ok = true;
        }
    } catch (e) {}
    if (!ok) {
        document.documentElement.style.display = 'none';
        location.replace('login.html');
    }
}());
