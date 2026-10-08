/* Akun Rafi Cinema.
   - Mode "server": akun, profil, favorit, dan paket disimpan di server (server/index.js), jadi
     perubahan di satu perangkat langsung muncul di perangkat lain yang login ke akun yang sama.
   - Mode "lokal": dipakai otomatis bila situs dibuka tanpa server (file langsung / hosting statis).
     Data hanya tersimpan di browser itu (seperti versi sebelumnya).
   localStorage dipakai sebagai cache agar halaman tampil instan, lalu disinkronkan ke server. */
(function (w) {
    var MEMBERS = 'rafi-cinema-members', SESSION = 'rafi-cinema-session', OWNER = 'rafiabdlhfzh@gmail.com',
        LOGOUT = 'rafi-cinema-loggedout', MODE = 'rafi-cinema-mode', PFX = 'rafi-cinema-profile:',
        FAVS = 'rafi-cinema-favs', PEND = 'rafi-cinema-pending', REV = 'rafi-cinema-rev';
    var LEGACY = { Basic: 'Silver', Standar: 'Gold', Premium: 'Platinum' };

    function plan(p) { return p ? (LEGACY[p] || p) : null; }
    function read(key, fallback) {
        try { var v = JSON.parse(localStorage.getItem(key)); return v == null ? fallback : v; }
        catch (e) { return fallback; }
    }
    function write(key, val) {
        try { localStorage.setItem(key, JSON.stringify(val)); return true; } catch (e) { return false; }
    }
    function rm(key) { try { localStorage.removeItem(key); } catch (e) {} }
    function key(email) { return String(email).trim().toLowerCase(); }
    function mode() {
        try { return localStorage.getItem(MODE) === 'server' ? 'server' : 'local'; } catch (e) { return 'local'; }
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

    /* ---------- server ---------- */
    function api(method, path, body) {
        var o = { method: method, headers: {}, credentials: 'same-origin', cache: 'no-store' };
        if (body !== undefined) { o.headers['Content-Type'] = 'application/json'; o.body = JSON.stringify(body); }
        return fetch('api/' + path, o).then(function (r) {
            return r.json().catch(function () { return {}; }).then(function (j) { j.status = r.status; j.ok = j.ok === true && r.ok; return j; });
        });
    }
    function sig() {
        var u = read(SESSION, null), em = u && u.email;
        return [localStorage.getItem(SESSION), em ? localStorage.getItem(PFX + em) : '', localStorage.getItem(FAVS)].join('|');
    }
    function emit() { document.dispatchEvent(new CustomEvent('rafi-sync')); }
    // Simpan data akun dari server ke cache lokal; beri tahu halaman bila ada yang berubah.
    function applyUser(u) {
        var before = sig();
        write(SESSION, { nama: u.nama, email: u.email, plan: plan(u.plan), price: u.price, bayar: u.bayar, since: u.since, owner: !!u.owner });
        write(PFX + u.email, u.profile || {});
        write(FAVS, u.favs || []);
        write(REV, u.rev);
        if (sig() !== before) emit();
    }
    function clearCache() {
        var u = read(SESSION, null);
        rm(SESSION); rm(FAVS); rm(REV); rm(PEND);
        if (u && u.email) rm(PFX + u.email);
    }
    function onAuthPage() { return /(^|\/)(login|daftar-akun)\.html$/.test(location.pathname); }
    function expired() {
        clearCache();
        if (!onAuthPage()) {
            var f = (location.pathname.split('/').pop() || 'index.html') + location.search + location.hash;
            location.replace('login.html?next=' + encodeURIComponent(f));
        }
    }

    /* ---------- antrean perubahan (aman saat offline) ---------- */
    function pend() { return read(PEND, {}); }
    function setPend(p) { if (!p.profile && !p.favs) rm(PEND); else write(PEND, p); }
    function ack(kind, sent) {
        var p = pend();
        if (kind === 'favs') { if (JSON.stringify(p.favs) === JSON.stringify(sent)) delete p.favs; }
        else if (p.profile) {
            Object.keys(sent).forEach(function (k) { if (JSON.stringify(p.profile[k]) === JSON.stringify(sent[k])) delete p.profile[k]; });
            if (!Object.keys(p.profile).length) delete p.profile;
        }
        setPend(p);
    }
    var flushing = false, again = false;
    function flush() {
        if (mode() !== 'server' || !Auth.current()) return Promise.resolve(true);
        var p = pend();
        if (!p.profile && !p.favs) return Promise.resolve(true);
        if (flushing) { again = true; return Promise.resolve(false); }
        flushing = true;
        var chain = Promise.resolve(true);
        function step(kind, method, path, body, sent) {
            chain = chain.then(function (ok) {
                if (!ok) return false;
                return api(method, path, body).then(function (r) {
                    if (r.status === 401) { expired(); return false; }
                    if (r.status >= 500) return false;
                    ack(kind, sent);        // sukses, atau ditolak validasi (jangan diulang terus)
                    return true;
                });
            });
        }
        if (p.profile) step('profile', 'PATCH', 'me/profile', { profile: p.profile }, p.profile);
        if (p.favs) step('favs', 'PUT', 'me/favs', { favs: p.favs }, p.favs);
        return chain.catch(function () { return false; }).then(function (ok) {
            flushing = false;
            if (again) { again = false; return flush(); }
            return ok;
        });
    }
    function pull() {
        if (mode() !== 'server' || !Auth.current()) return Promise.resolve();
        return flush().then(function (ok) {
            if (!ok) return;
            var p = pend(); if (p.profile || p.favs) return;
            return api('GET', 'me?rev=' + encodeURIComponent(read(REV, 0))).then(function (r) {
                if (r.status === 401) return expired();
                if (r.ok && !r.unchanged && r.user) applyUser(r.user);
            });
        }).catch(function () {});
    }

    /* ---------- API publik ---------- */
    var Auth = {
        mode: mode,
        // Cek apakah situs dijalankan bersama server akun. Hasilnya diingat untuk halaman lain.
        detect: function () {
            function set(m) { try { localStorage.setItem(MODE, m); } catch (e) {} return m; }
            if (!w.fetch || location.protocol === 'file:') return Promise.resolve(set('local'));
            return fetch('api/health', { cache: 'no-store' })
                .then(function (r) { return r.ok ? r.json() : null; })
                .then(function (j) { return set(j && j.server === true ? 'server' : 'local'); })
                .catch(function () { return set('local'); });
        },
        exists: function (email) { return !!read(MEMBERS, {})[key(email)]; },
        register: function (m) {
            if (mode() === 'server') {
                return api('POST', 'register', { nama: m.nama, email: m.email, password: m.password })
                    .then(function (r) {
                        if (r.ok && r.user) { rm(LOGOUT); applyUser(r.user); return { ok: true, user: r.user }; }
                        return { ok: false, error: r.status === 409 ? 'exists' : (r.error || 'server') };
                    }).catch(function () { return { ok: false, error: 'network' }; });
            }
            var all = read(MEMBERS, {}), k = key(m.email);
            if (all[k]) return Promise.resolve({ ok: false, error: 'exists' });
            return hash(m.password).then(function (h) {
                all[k] = { nama: m.nama, email: k, hash: h, plan: plan(m.plan), price: m.price, bayar: m.bayar, since: new Date().toISOString() };
                return write(MEMBERS, all) ? { ok: true } : { ok: false, error: 'storage' };
            });
        },
        // Server: email + password harus cocok dengan akun. Lokal (demo): email/password apa saja bisa masuk.
        login: function (email, password) {
            if (!String(email).trim() || !password) return Promise.resolve({ ok: false });
            if (mode() === 'server') {
                return api('POST', 'login', { email: email, password: password }).then(function (r) {
                    if (r.ok && r.user) { rm(LOGOUT); applyUser(r.user); return { ok: true, user: r.user }; }
                    return { ok: false, error: r.status === 429 ? 'toomany' : 'credentials' };
                }).catch(function () { return { ok: false, error: 'network' }; });
            }
            var m = read(MEMBERS, {})[key(email)], user;
            if (m) user = { nama: m.nama, email: m.email, plan: plan(m.plan), price: m.price, bayar: m.bayar, since: m.since };
            else {
                var local = key(email).split('@')[0].replace(/[._-]+/g, ' ').trim() || 'Pengguna';
                user = { nama: local.replace(/\b\w/g, function (c) { return c.toUpperCase(); }), email: key(email), plan: null, price: null, bayar: null, since: new Date().toISOString() };
            }
            if (key(email) === OWNER && !m) user.nama = 'Rafi Abdul Hafizh';
            rm(LOGOUT);
            return Promise.resolve(write(SESSION, user) ? { ok: true, user: user } : { ok: false, error: 'storage' });
        },
        // Pasang paket membership ke akun yang sedang login.
        subscribe: function (d) {
            var u = Auth.current();
            if (!u) return Promise.resolve({ ok: false, error: 'nologin' });
            if (mode() === 'server') {
                return api('POST', 'me/subscribe', { nama: d.nama, hp: d.hp, plan: d.plan, bayar: d.bayar }).then(function (r) {
                    if (r.status === 401) return { ok: false, error: 'nologin' };
                    if (r.ok && r.user) { applyUser(r.user); return { ok: true, user: Auth.current() }; }
                    return { ok: false, error: r.error || 'server' };
                }).catch(function () { return { ok: false, error: 'network' }; });
            }
            var all = read(MEMBERS, {}), k = key(u.email);
            var m = all[k] || { email: k, hash: '', since: u.since || new Date().toISOString() };
            m.nama = d.nama || m.nama || u.nama; m.plan = plan(d.plan); m.price = d.price; m.bayar = d.bayar;
            if (d.hp) m.hp = d.hp;
            all[k] = m;
            var user = { nama: m.nama, email: k, plan: m.plan, price: m.price, bayar: m.bayar, since: m.since };
            return Promise.resolve((write(MEMBERS, all) && write(SESSION, user)) ? { ok: true, user: user } : { ok: false, error: 'storage' });
        },
        logout: function () {
            function done() { try { localStorage.setItem(LOGOUT, '1'); } catch (e) {} location.replace('login.html'); }
            if (mode() === 'server') {
                flush().then(function () { return api('POST', 'logout', {}); }).catch(function () {}).then(function () { clearCache(); done(); });
                return;
            }
            rm(SESSION); done();
        },
        loggedOut: function () { try { return !!localStorage.getItem(LOGOUT); } catch (e) { return false; } },
        // Hanya mode lokal: masuk otomatis sebagai pemilik (perilaku demo lama).
        enterOwner: function () {
            var m = read(MEMBERS, {})[OWNER] || {};
            return write(SESSION, { nama: m.nama || 'Rafi Abdul Hafizh', email: OWNER, plan: plan(m.plan), price: m.price || null, bayar: m.bayar || null, since: m.since || '2026-10-05T00:00:00.000Z' });
        },
        current: function () {
            var u = read(SESSION, null);
            if (!u || typeof u !== 'object') return null;
            u.plan = plan(u.plan);
            if (u.owner === undefined) u.owner = u.email === OWNER;
            return u;
        },
        // Dipanggil halaman setelah mengubah profil / favorit: kirim ke server (mode server saja).
        syncProfile: function (patch) {
            if (mode() !== 'server' || !Auth.current()) return;
            var p = pend(); p.profile = Object.assign({}, p.profile, patch); setPend(p); flush();
        },
        syncFavs: function (list) {
            if (mode() !== 'server' || !Auth.current()) return;
            var p = pend(); p.favs = list.slice(); setPend(p); flush();
        },
        pull: pull,
        profile: function () { var u = Auth.current(); return u ? read(PFX + u.email, {}) : {}; }
    };
    w.RafiAuth = Auth;

    /* ---------- menu akun di header ---------- */
    function esc(t) { return String(t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
    function menuSig(u) { var p = Auth.profile(); return [u.nama, u.email, u.plan, p.foto ? p.foto.length : 0].join('|'); }
    function buildAccount(bar, u) {
        var p = Auth.profile();
        var ini = String(u.nama || u.email).trim().split(/\s+/).slice(0, 2).map(function (x) { return x.charAt(0); }).join('').toUpperCase() || '?';
        var planTxt = u.plan ? 'Paket ' + esc(u.plan) : 'Belum berlangganan';
        var face = p.foto ? '<img class="acc-img" src="' + esc(p.foto) + '" alt="">' : '<span class="acc-ini">' + esc(ini) + '</span>';
        var wrap = document.createElement('div');
        wrap.className = 'account';
        wrap.dataset.sig = menuSig(u);
        wrap.innerHTML =
            '<button type="button" class="icon-btn acc-btn" aria-haspopup="menu" aria-expanded="false" aria-label="Akun saya" title="Akun saya">' + face + '</button>' +
            '<div class="acc-menu" role="menu" hidden>' +
            '<div class="acc-head"><b>' + esc(u.nama || 'Akun') + '</b><small>' + esc(u.email) + '</small><span class="acc-plan' + (u.plan ? ' on plan-' + esc(String(u.plan).toLowerCase()) : '') + '">' + planTxt + '</span></div>' +
            '<a role="menuitem" href="kontak.html">Profil saya</a>' +
            '<a role="menuitem" href="daftar-saya.html">Daftar Saya</a>' +
            '<a role="menuitem" href="member.html">' + (u.plan ? 'Kelola paket' : 'Lihat paket langganan') + '</a>' +
            '<button type="button" role="menuitem" class="acc-out">Logout</button></div>';
        bar.appendChild(wrap);
        var btn = wrap.querySelector('.acc-btn'), menu = wrap.querySelector('.acc-menu');
        function close() { menu.hidden = true; btn.setAttribute('aria-expanded', 'false'); }
        btn.addEventListener('click', function (e) { e.stopPropagation(); var open = menu.hidden; menu.hidden = !open; btn.setAttribute('aria-expanded', String(open)); });
        document.addEventListener('click', function (e) { if (wrap.isConnected && !wrap.contains(e.target)) close(); });
        document.addEventListener('keydown', function (e) { if (wrap.isConnected && e.key === 'Escape') { close(); btn.focus(); } });
        wrap.querySelector('.acc-out').addEventListener('click', Auth.logout);
    }

    document.addEventListener('DOMContentLoaded', function () {
        var u = Auth.current(), link = document.querySelector('.links a[href="login.html"]');
        if (!u) {
            // Belum login: sembunyikan menu halaman yang dilindungi.
            document.body.classList.add('guest');
            return;
        }
        // Sudah login: menu "Login" dihilangkan dari navigasi (akses lewat Profil).
        if (link) link.remove();
        var bar = document.querySelector('.top-actions');
        if (bar && !bar.querySelector('.account')) buildAccount(bar, u);
        else if (!bar) {
            // Cadangan: tombol Logout di panel Display bila header tidak punya menu akun.
            var panel = document.querySelector('.settings-panel');
            if (panel) {
                var b = document.createElement('button');
                b.type = 'button'; b.className = 'button outline panel-logout'; b.textContent = 'Logout';
                b.addEventListener('click', Auth.logout);
                panel.appendChild(b);
            }
        }

        if (mode() !== 'server') return;
        // Sinkronisasi: saat halaman dibuka, lalu berkala, dan saat kembali ke tab / online.
        document.addEventListener('rafi-sync', function () {
            var cur = Auth.current(), bar2 = document.querySelector('.top-actions'), old = bar2 && bar2.querySelector('.account');
            if (!cur || !bar2 || !old || old.dataset.sig === menuSig(cur)) return;
            var wasOpen = !old.querySelector('.acc-menu').hidden;
            old.remove(); buildAccount(bar2, cur);
            if (wasOpen) { var nb = bar2.querySelector('.acc-btn'); if (nb) nb.click(); }
        });
        pull();
        setInterval(function () { if (!document.hidden) pull(); }, 10000);
        document.addEventListener('visibilitychange', function () { if (!document.hidden) pull(); });
        w.addEventListener('focus', pull);
        w.addEventListener('online', pull);
    });
}(window));
