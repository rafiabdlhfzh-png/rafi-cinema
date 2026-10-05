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
        // Tombol Logout di panel Display (ada di semua halaman, termasuk mobile).
        var panel = document.querySelector('.settings-panel');
        if (panel) {
            var b = document.createElement('button');
            b.type = 'button'; b.className = 'button outline panel-logout'; b.textContent = 'Logout';
            b.addEventListener('click', Auth.logout);
            panel.appendChild(b);
        }
    });
}(window));
