(function () {
    var KEY = 'rafi-cinema-theme';
    var root = document.documentElement;
    var media = window.matchMedia('(prefers-color-scheme: light)');
    var COLORS = { dark: '#0f0d14', light: '#fbf8fd' };

    function getSaved() {
        try {
            var v = localStorage.getItem(KEY);
            return v === 'light' || v === 'dark' ? v : 'auto';
        } catch (e) {
            return 'auto';
        }
    }

    function apply(pref) {
        var theme = pref === 'auto' ? (media.matches ? 'light' : 'dark') : pref;
        root.setAttribute('data-theme', theme);
        var meta = document.querySelector('meta[name="theme-color"]');
        if (meta) meta.setAttribute('content', COLORS[theme]);
    }

    // Dijalankan di <head>, jadi tema langsung benar sebelum halaman tampil (tanpa kedip).
    apply(getSaved());

    // Saat pilihan "Otomatis", ikuti perubahan tema perangkat secara langsung.
    var onSystemChange = function () {
        if (getSaved() === 'auto') apply('auto');
    };
    if (media.addEventListener) media.addEventListener('change', onSystemChange);
    else if (media.addListener) media.addListener(onSystemChange);

    document.addEventListener('DOMContentLoaded', function () {
        var select = document.querySelector('#theme-mode');
        var settings = document.querySelector('.display-settings');
        var toggle = document.querySelector('.mode-toggle');
        if (!select) return;
        select.value = getSaved();
        select.addEventListener('change', function () {
            try { localStorage.setItem(KEY, select.value); } catch (e) {}
            apply(select.value);
            if (settings) settings.classList.remove('is-open');
            if (toggle) toggle.setAttribute('aria-expanded', 'false');
        });
    });

    // Sinkronkan antar tab / halaman yang terbuka bersamaan.
    window.addEventListener('storage', function (e) {
        if (e.key !== KEY) return;
        apply(getSaved());
        var select = document.querySelector('#theme-mode');
        if (select) select.value = getSaved();
    });
}());
