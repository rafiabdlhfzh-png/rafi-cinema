(function () {
    var KEY = 'rafi-cinema-theme';
    var root = document.documentElement;
    var mq = window.matchMedia('(prefers-color-scheme: dark)');
    var pref = null;
    try { pref = localStorage.getItem(KEY); } catch (e) {}
    if (pref !== 'light' && pref !== 'dark') pref = 'auto';

    function apply(p) {
        var theme = p === 'auto' ? (mq.matches ? 'dark' : 'light') : p;
        var meta = document.querySelector('meta[name="theme-color"]');
        root.setAttribute('data-theme', theme);
        if (meta) meta.setAttribute('content', theme === 'light' ? '#faf7fc' : '#0f0d14');
    }

    apply(pref);

    window.RafiTheme = {
        get: function () { return pref; },
        set: function (p) {
            pref = (p === 'light' || p === 'dark') ? p : 'auto';
            try { localStorage.setItem(KEY, pref); } catch (e) {}
            apply(pref);
        }
    };

    function onSystemChange() { if (pref === 'auto') apply(pref); }
    if (mq.addEventListener) mq.addEventListener('change', onSystemChange);
    else if (mq.addListener) mq.addListener(onSystemChange);
}());
