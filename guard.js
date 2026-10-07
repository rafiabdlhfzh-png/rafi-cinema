/* Penjaga halaman: jalankan di <head>. Halaman hanya terbuka bila sudah login.
   (Hanya mode lokal / tanpa server: langsung masuk sebagai akun demo pemilik, kecuali sudah menekan Logout.) */
(function () {
    var OWNER = 'rafiabdlhfzh@gmail.com', ok = false;
    try {
        ok = !!localStorage.getItem('rafi-cinema-session');
        if (!ok && localStorage.getItem('rafi-cinema-mode') === 'local' && !localStorage.getItem('rafi-cinema-loggedout')) {
            var m = {};
            try { m = (JSON.parse(localStorage.getItem('rafi-cinema-members')) || {})[OWNER] || {}; } catch (e) {}
            localStorage.setItem('rafi-cinema-session', JSON.stringify({ nama: m.nama || 'Rafi Abdul Hafizh', email: OWNER, plan: m.plan || null, price: m.price || null, bayar: m.bayar || null, since: m.since || '2026-10-05T00:00:00.000Z' }));
            ok = true;
        }
    } catch (e) {}
    if (!ok) {
        document.documentElement.style.display = 'none';
        var f = (location.pathname.split('/').pop() || 'index.html') + location.search + location.hash;
        location.replace('login.html?next=' + encodeURIComponent(f));
    }
}());
