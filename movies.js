/* Data film + penyimpanan favorit Rafi Cinema (sisi-klien, tanpa server). */
(function (w) {
    var MOVIES = [
 {
  "id": "john-wick-4",
  "title": "John Wick: Chapter 4",
  "genre": "action",
  "genreLabel": "Action",
  "year": 2023,
  "duration": "169 menit",
  "avail": "Resolusi 4K tersedia",
  "score": 7.7,
  "synopsis": "Setelah kembali diburu oleh High Table, John Wick mencari cara untuk merebut kebebasannya. Perjalanannya melintasi Osaka, Berlin, dan Paris membawanya pada duel melawan Marquis de Gramont serta Caine, sahabat lama yang dipaksa menjadi lawan.",
  "cast": [
   "Keanu Reeves",
   "Donnie Yen",
   "Bill Skarsgård",
   "Laurence Fishburne",
   "Hiroyuki Sanada",
   "Shamier Anderson",
   "Lance Reddick",
   "Rina Sawayama",
   "Marko Zaror",
   "Scott Adkins",
   "Clancy Brown",
   "Ian McShane",
   "Aimée Kwan",
   "Natalia Tena",
   "George Georgiou",
   "Bridget Moynahan",
   "Klaus Shields",
   "Andrej Kaminsky",
   "Yoshinori Tashiro",
   "Hishofuji Hiroki"
  ],
  "poster": "Jhon wick 4.jpeg",
  "trailer": "https://www.youtube.com/embed/qEVUtrk8_B4",
  "audio": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
 },
 {
  "id": "a-quiet-place",
  "title": "A Quiet Place",
  "genre": "thriller",
  "genreLabel": "Thriller",
  "year": 2018,
  "duration": "90 menit",
  "avail": "Resolusi 4K tersedia",
  "score": 7.5,
  "synopsis": "Di dunia yang dikuasai makhluk pemburu suara, keluarga Abbott bertahan hidup dengan bergerak dan berkomunikasi dalam senyap. Saat Evelyn menantikan kelahiran anaknya, mereka harus menemukan cara baru untuk menjaga seluruh keluarga tetap aman.",
  "cast": [
   "Emily Blunt",
   "John Krasinski",
   "Millicent Simmonds",
   "Noah Jupe",
   "Cade Woodward",
   "Leon Russom"
  ],
  "poster": "A Quiet Place.jpeg",
  "trailer": "https://www.youtube.com/embed/WR7cc5t7tv8",
  "audio": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3"
 },
 {
  "id": "the-conjuring",
  "title": "The Conjuring",
  "genre": "horor",
  "genreLabel": "Horor",
  "year": 2013,
  "duration": "112 menit",
  "avail": "HD 1080p",
  "score": 7.5,
  "synopsis": "Pasangan penyelidik paranormal Ed dan Lorraine Warren dipanggil untuk membantu keluarga Perron yang mengalami kejadian mengerikan di rumah pertanian baru mereka. Penyelidikan itu mengungkap kehadiran gelap yang mengancam seluruh keluarga.",
  "cast": [
   "Vera Farmiga",
   "Patrick Wilson",
   "Lili Taylor",
   "Ron Livingston",
   "Shanley Caswell",
   "Hayley McFarland",
   "Joey King",
   "Mackenzie Foy",
   "Kyla Deaver",
   "Shannon Kook",
   "John Brotherton",
   "Sterling Jerins",
   "Marion Guyot",
   "Morganna Bridgers",
   "Amy Tipton",
   "Zach Pappas",
   "Joseph Bishara",
   "Christof Veillon",
   "Steve Coulter",
   "Lorraine Warren"
  ],
  "poster": "The Conjuring.jpeg",
  "trailer": "https://www.youtube.com/embed/k10ETZ41q5o",
  "audio": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3"
 },
 {
  "id": "free-guy",
  "title": "Free Guy",
  "genre": "komedi",
  "genreLabel": "Komedi",
  "year": 2021,
  "duration": "115 menit",
  "avail": "Sedang tren #1",
  "score": 7.1,
  "synopsis": "Guy, seorang pegawai bank yang ramah, menyadari bahwa dirinya hanyalah karakter non-pemain di dalam gim daring. Bersama Millie, seorang pengembang gim, ia berusaha menyelamatkan dunianya sekaligus mengungkap pencurian kode di balik permainan tersebut.",
  "cast": [
   "Ryan Reynolds",
   "Jodie Comer",
   "Lil Rel Howery",
   "Joe Keery",
   "Utkarsh Ambudkar",
   "Taika Waititi",
   "Channing Tatum",
   "Matty Cardarople",
   "Aaron W. Reed",
   "Jacksepticeye",
   "Ninja",
   "Pokimane",
   "DanTDM",
   "LazarBeam",
   "Chris Evans",
   "Lara Spencer",
   "Alex Trebek",
   "Hugh Jackman",
   "Dwayne Johnson",
   "Tina Fey",
   "John Krasinski"
  ],
  "poster": "Free Guy (2021).jpeg",
  "trailer": "https://www.youtube.com/embed/XAHprLW48no",
  "audio": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3"
 },
 {
  "id": "la-la-land",
  "title": "La La Land",
  "genre": "drama",
  "genreLabel": "Drama",
  "year": 2016,
  "duration": "128 menit",
  "avail": "HD 1080p",
  "score": 8.0,
  "synopsis": "Di Los Angeles, Mia mengejar cita-cita sebagai aktris sementara Sebastian bermimpi membuka klub jazz. Hubungan mereka tumbuh bersama perjuangan meraih impian, lalu diuji ketika kesempatan karier membawa keduanya ke arah yang berbeda.",
  "cast": [
   "Ryan Gosling",
   "Emma Stone",
   "John Legend",
   "Rosemarie DeWitt",
   "Finn Wittrock",
   "J. K. Simmons",
   "Callie Hernandez",
   "Sonoya Mizuno",
   "Jessica Rothe",
   "Tom Everett Scott",
   "Amiee Conn",
   "Anna Chazelle",
   "Josh Pence",
   "Meagen Fay",
   "Damon Gupton",
   "Jason Fuchs",
   "Marius de Vries",
   "Olivia Hamilton",
   "Hemky Madera",
   "Valarie Rae Miller",
   "Miles Anderson",
   "Khirye Tyler"
  ],
  "poster": "La La Land - Official Movie Site - Now Playing.jpeg",
  "trailer": "https://www.youtube.com/embed/0pdqf4P9MB8",
  "audio": "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3"
 }
];
    var KEY = 'rafi-cinema-favs';
    function esc(t) { return String(t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
    function read() { try { var v = JSON.parse(localStorage.getItem(KEY)); return Array.isArray(v) ? v : []; } catch (e) { return []; } }
    function write(a) {
        try { localStorage.setItem(KEY, JSON.stringify(a)); } catch (e) {}
        // Kirim ke server (mode server) supaya favorit sama di semua perangkat.
        if (w.RafiAuth && w.RafiAuth.syncFavs) w.RafiAuth.syncFavs(a);
    }
    // Tombol like: <button class="like-btn" data-fav="id" data-title="Judul">; keadaannya selalu mengikuti data favorit.
    function syncLikes() {
        [].forEach.call(document.querySelectorAll('button[data-fav]'), function (b) {
            var on = M.isFav(b.dataset.fav), t = b.dataset.title || 'film ini';
            b.setAttribute('aria-pressed', on ? 'true' : 'false');
            b.setAttribute('aria-label', (on ? 'Hapus ' + t + ' dari' : 'Tambah ' + t + ' ke') + ' Daftar Saya');
            b.title = on ? 'Hapus dari Daftar Saya' : 'Tambah ke Daftar Saya';
        });
    }
    var M = {
        all: MOVIES,
        get: function (id) { return MOVIES.filter(function (m) { return m.id === id; })[0] || null; },
        byTitle: function (t) { return MOVIES.filter(function (m) { return m.title === t; })[0] || null; },
        url: function (id) { return 'film-detail.html?id=' + encodeURIComponent(id); },
        favs: function () { return read().filter(function (id) { return !!M.get(id); }); },
        isFav: function (id) { return read().indexOf(id) > -1; },
        toggle: function (id) {
            var a = read(), i = a.indexOf(id);
            if (i > -1) a.splice(i, 1); else a.push(id);
            write(a); M.refresh();
            return i === -1;
        },
        refresh: function () {
            var n = M.favs().length;
            [].forEach.call(document.querySelectorAll('.top-actions .count'), function (el) { el.textContent = n; el.hidden = !n; });
            syncLikes();
            document.dispatchEvent(new CustomEvent('favs-changed'));
        },
        toast: function (msg) {
            var t = document.querySelector('.toast-msg');
            if (!t) { t = document.createElement('div'); t.className = 'toast-msg'; t.setAttribute('role', 'status'); document.body.appendChild(t); }
            t.textContent = msg; t.classList.add('show');
            clearTimeout(M._t); M._t = setTimeout(function () { t.classList.remove('show'); }, 2200);
        },
        // Trailer dibuka di jendela popup (satu pemutar saja, otomatis berhenti saat ditutup).
        openTrailer: function (url, title) {
            if (!/^https:\/\/www\.youtube\.com\/embed\/[\w-]+$/.test(url)) return;
            var d = document.getElementById('trailer-dialog');
            if (!d) {
                d = document.createElement('dialog');
                d.id = 'trailer-dialog'; d.className = 'trailer-dialog'; d.setAttribute('aria-labelledby', 'td-title');
                d.innerHTML = '<div class="td-head"><b id="td-title"></b><button type="button" class="td-x" aria-label="Tutup trailer">&times;</button></div><div class="td-frame"></div>';
                document.body.appendChild(d);
                var close = function () { d.querySelector('.td-frame').innerHTML = ''; if (d.close) d.close(); else d.removeAttribute('open'); };
                d.addEventListener('click', function (e) { if (e.target === d) close(); });
                d.querySelector('.td-x').addEventListener('click', close);
                d.addEventListener('close', function () { d.querySelector('.td-frame').innerHTML = ''; });
            }
            d.querySelector('#td-title').textContent = title || 'Trailer';
            d.querySelector('.td-frame').innerHTML = '<iframe src="' + url + '?autoplay=1&rel=0" title="' + esc(title || 'Trailer') + '" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>';
            if (d.showModal) { if (!d.open) d.showModal(); } else d.setAttribute('open', '');
        }
    };
    w.RafiMovies = M;

    document.addEventListener('click', function (e) {
        var like = e.target.closest && e.target.closest('button[data-fav]');
        if (like) {
            var on = M.toggle(like.dataset.fav);
            like.classList.remove('pop'); void like.offsetWidth; if (on) like.classList.add('pop');
            M.toast(on ? 'Ditambahkan ke Daftar Saya' : 'Dihapus dari Daftar Saya');
            return;
        }
        var tr = e.target.closest && e.target.closest('[data-trailer]');
        if (tr) M.openTrailer(tr.dataset.trailer, tr.dataset.title);
    });
    document.addEventListener('DOMContentLoaded', M.refresh);
    document.addEventListener('rafi-sync', M.refresh);
    w.addEventListener('storage', M.refresh);
}(window));
