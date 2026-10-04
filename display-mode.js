(function () {
    const modeSelect = document.querySelector('#display-mode');
    const settings = document.querySelector('.display-settings');
    const modeToggle = document.querySelector('.mode-toggle');
    const legacy = { android: 'mobile', windows: 'desktop' };
    let savedMode = localStorage.getItem('rafi-cinema-display-mode') || 'auto';
    savedMode = legacy[savedMode] || savedMode;

    const narrow = window.matchMedia('(max-width: 760px)');

    function applyMode(mode) {
        document.body.classList.remove('mode-mobile', 'mode-desktop');
        if (mode !== 'auto') {
            document.body.classList.add(`mode-${mode}`);
        } else if (narrow.matches) {
            document.body.classList.add('mode-mobile');
        }
        if (modeSelect) {
            modeSelect.value = mode;
        }
    }

    applyMode(savedMode);
    narrow.addEventListener('change', function () {
        applyMode(modeSelect ? modeSelect.value : savedMode);
    });

    if (modeSelect) {
        modeSelect.addEventListener('change', function () {
            localStorage.setItem('rafi-cinema-display-mode', modeSelect.value);
            applyMode(modeSelect.value);
            settings.classList.remove('is-open');
            modeToggle.setAttribute('aria-expanded', 'false');
        });
    }

    if (modeToggle) {
        modeToggle.addEventListener('click', function () {
            const isOpen = settings.classList.toggle('is-open');
            modeToggle.setAttribute('aria-expanded', String(isOpen));
        });
        document.addEventListener('click', function (event) {
            if (!settings.contains(event.target)) {
                settings.classList.remove('is-open');
                modeToggle.setAttribute('aria-expanded', 'false');
            }
        });
    }
}());
