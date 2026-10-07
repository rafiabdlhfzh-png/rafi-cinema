/* Auth demo sisi-klien Rafi Cinema.
   Data disimpan di localStorage browser (tanpa server). Kata sandi hanya disimpan
   dalam bentuk hash, dan nomor kartu tidak disimpan (hanya 4 digit terakhir). */
(function (w) {
    var MEMBERS = 'rafi-cinema-members', SESSION = 'rafi-cinema-session', OWNER = 'rafiabdlhfzh@gmail.com', LOGOUT = 'rafi-cinema-loggedout';

    function read(key, fallback) {
        try { var v = JSON.parse(localStorage.getItem(key)); return v == null ? fallback : v; }
        catch (e) { return fallback; }
    }
    function write(key, val) {
        try { localStorage.setItem(key, JSON.stringify(val)); return true; } catch (e) { return false; }
    }
    function fallbackHash(s) {
        var h = 5381, i; for (i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) | 0;
        return 'f' + (h >>> 0).toString(16);
    }
    function hash(text) {
        var data = 'rafi-cinema:' + text;
        if (w.crypto && w.crypto.subtle && w.TextEncoder) {
            return w.crypto.subtle.digest('SHA-256', new TextEncoder().encode(data)).then(function (b) {
                return Array.prototype.map.call(new Uint8Array(b), function (x) { return ('0' + x.toString(16)).slice(-2); }).join('');
            }).catch(function () { return fallbackHash(data); });
        }
        return Promise.resolve(fallbackHash(data));
    }
    function key(email) { return String(email).trim().toLowerCase(); }

    var Auth = {
        exists: function (email) { return !!read(MEMBERS, {})[key(email)]; },
        register: function (m) {
            var all = read(MEMBERS, {}), k = key(m.email);
            if (all[k]) return Promise.resolve({ ok: false, error: 'exists' });
            return hash(m.password).then(function (h) {
                all[k] = { nama: m.nama, email: k, hash: h, plan: m.plan, price: m.price, bayar: m.bayar, since: new Date().toISOString() };
                return write(MEMBERS, all) ? { ok: true } : { ok: false, error: 'storage' };
            });
        },
        // Mode demo: email/username dan password apa saja bisa masuk (asal tidak kosong).
        // Kalau email cocok dengan anggota terdaftar, datanya (paket, pembayaran) dipakai.
        login: function (email, password) {
            if (!String(email).trim() || !password) return { ok: false };
            var m = read(MEMBERS, {})[key(email)], user;
            if (m) user = { nama: m.nama, email: m.email, plan: m.plan, price: m.price, bayar: m.bayar, since: m.since };
            else {
                var local = key(email).split('@')[0].replace(/[._-]+/g, ' ').trim() || 'Pengguna';
                user = { nama: local.replace(/\b\w/g, function (c) { return c.toUpperCase(); }), email: key(email), plan: null, price: null, bayar: null, since: new Date().toISOString() };
            }
            if (key(email) === OWNER && !m) user.nama = 'Rafi Abdul Hafizh';
            try { localStorage.removeItem(LOGOUT); } catch (e) {}
            return write(SESSION, user) ? { ok: true, user: user } : { ok: false, error: 'storage' };
        },
        // Pasang paket membership ke akun yang sedang login (tanpa membuat akun baru).
        subscribe: function (d) {
            var u = Auth.current();
            if (!u) return { ok: false, error: 'nologin' };
            var all = read(MEMBERS, {}), k = key(u.email);
            var m = all[k] || { email: k, hash: '', since: u.since || new Date().toISOString() };
            m.nama = d.nama || m.nama || u.nama; m.plan = d.plan; m.price = d.price; m.bayar = d.bayar;
            if (d.hp) m.hp = d.hp;
            all[k] = m;
            var user = { nama: m.nama, email: k, plan: m.plan, price: m.price, bayar: m.bayar, since: m.since };
            return (write(MEMBERS, all) && write(SESSION, user)) ? { ok: true, user: user } : { ok: false, error: 'storage' };
        },
        logout: function () { try { localStorage.removeItem(SESSION); localStorage.setItem(LOGOUT, '1'); } catch (e) {} location.replace('login.html'); },
        loggedOut: function () { try { return !!localStorage.getItem(LOGOUT); } catch (e) { return false; } },
        enterOwner: function () {
            var m = read(MEMBERS, {})[OWNER] || {};
            return write(SESSION, { nama: m.nama || 'Rafi Abdul Hafizh', email: OWNER, plan: m.plan || null, price: m.price || null, bayar: m.bayar || null, since: m.since || '2026-10-05T00:00:00.000Z' });
        },
        current: function () { var u = read(SESSION, null); return u && typeof u === 'object' ? u : null; }
    };

    function esc(t) { return String(t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
    function buildAccount(bar, u) {
        var ini = String(u.nama || u.email).trim().split(/\s+/).slice(0, 2).map(function (x) { return x.charAt(0); }).join('').toUpperCase() || '?';
        var plan = u.plan ? 'Paket ' + esc(u.plan) : 'Belum berlangganan';
        var wrap = document.createElement('div');
        wrap.className = 'account';
        wrap.innerHTML =
            '<button type="button" class="icon-btn acc-btn" aria-haspopup="menu" aria-expanded="false" aria-label="Akun saya" title="Akun saya"><span class="acc-ini">' + esc(ini) + '</span></button>' +
            '<div class="acc-menu" role="menu" hidden>' +
            '<div class="acc-head"><b>' + esc(u.nama || 'Akun') + '</b><small>' + esc(u.email) + '</small><span class="acc-plan' + (u.plan ? ' on' : '') + '">' + plan + '</span></div>' +
            '<a role="menuitem" href="kontak.html">Profil saya</a>' +
            '<a role="menuitem" href="daftar-saya.html">Daftar Saya</a>' +
            '<a role="menuitem" href="member.html">' + (u.plan ? 'Kelola paket' : 'Lihat paket langganan') + '</a>' +
            '<button type="button" role="menuitem" class="acc-out">Logout</button></div>';
        bar.appendChild(wrap);
        var btn = wrap.querySelector('.acc-btn'), menu = wrap.querySelector('.acc-menu');
        function close() { menu.hidden = true; btn.setAttribute('aria-expanded', 'false'); }
        btn.addEventListener('click', function (e) { e.stopPropagation(); var open = menu.hidden; menu.hidden = !open; btn.setAttribute('aria-expanded', String(open)); });
        document.addEventListener('click', function (e) { if (!wrap.contains(e.target)) close(); });
        document.addEventListener('keydown', function (e) { if (e.key === 'Escape') { close(); btn.focus(); } });
        wrap.querySelector('.acc-out').addEventListener('click', Auth.logout);
    }
    w.RafiAuth = Auth;

    document.addEventListener('DOMContentLoaded', function () {
        var u = Auth.current(), link = document.querySelector('.links a[href="login.html"]');
        if (!u) {
            // Belum login: sembunyikan menu halaman yang dilindungi.
            document.body.classList.add('guest');
            return;
        }
        // Sudah login: menu "Login" dihilangkan dari navigasi (akses lewat Profil).
        if (link) link.remove();
        // Menu akun (avatar) di header: nama, paket, pintasan, dan Logout.
        var bar = document.querySelector('.top-actions');
        if (bar && !bar.querySelector('.account')) { buildAccount(bar, u); return; }
        // Cadangan: tombol Logout di panel Display bila header tidak punya menu akun.
        var panel = document.querySelector('.settings-panel');
        if (panel) {
            var b = document.createElement('button');
            b.type = 'button'; b.className = 'button outline panel-logout'; b.textContent = 'Logout';
            b.addEventListener('click', Auth.logout);
            panel.appendChild(b);
        }
    });
}(window));
