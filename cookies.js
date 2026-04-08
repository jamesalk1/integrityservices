/**
 * Cookie Consent Banner – LöneCenter.se
 * Compliant with Swedish LEK + GDPR requirements:
 *  - Opt-in before non-essential cookies
 *  - Equal prominence for Accept / Reject
 *  - Granular category control
 *  - Easy withdrawal (re-open via footer link)
 */

(function () {
    'use strict';

    const CONSENT_KEY = 'lc_cookie_consent';
    const CONSENT_VERSION = 1;

    // ─── Helpers ────────────────────────────────────────────
    function getConsent() {
        try {
            const raw = localStorage.getItem(CONSENT_KEY);
            if (!raw) return null;
            const data = JSON.parse(raw);
            if (data.version !== CONSENT_VERSION) return null;
            return data;
        } catch { return null; }
    }

    function saveConsent(preferences) {
        const data = {
            version: CONSENT_VERSION,
            timestamp: new Date().toISOString(),
            analytics: !!preferences.analytics,
            marketing: !!preferences.marketing
        };
        localStorage.setItem(CONSENT_KEY, JSON.stringify(data));
    }

    // ─── Build Banner ───────────────────────────────────────
    function createBanner() {
        const overlay = document.createElement('div');
        overlay.id = 'cookie-overlay';
        overlay.innerHTML = `
            <div class="cookie-banner" id="cookie-banner" role="dialog" aria-label="Cookieinställningar">
                <div class="cookie-banner-inner">
                    <div class="cookie-header">
                        <div class="cookie-icon-wrap">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5"/><path d="M8.5 8.5v.01"/><path d="M16 15.5v.01"/><path d="M12 12v.01"/><path d="M11 17v.01"/><path d="M7 14v.01"/></svg>
                        </div>
                        <h3>Vi värnar om din integritet</h3>
                    </div>
                    <p>Vi använder cookies för att förbättra din upplevelse. Nödvändiga cookies krävs för att sidan ska fungera. Du väljer själv om du vill tillåta övriga.</p>
                    
                    <div class="cookie-categories" id="cookie-categories" style="display:none;">
                        <label class="cookie-toggle disabled">
                            <span class="cookie-toggle-info">
                                <strong>Nödvändiga</strong>
                                <small>Krävs för grundläggande funktioner</small>
                            </span>
                            <input type="checkbox" checked disabled>
                            <span class="toggle-slider locked"></span>
                        </label>
                        <label class="cookie-toggle">
                            <span class="cookie-toggle-info">
                                <strong>Analys</strong>
                                <small>Hjälper oss förstå hur sidan används</small>
                            </span>
                            <input type="checkbox" id="cookie-analytics">
                            <span class="toggle-slider"></span>
                        </label>
                        <label class="cookie-toggle">
                            <span class="cookie-toggle-info">
                                <strong>Marknadsföring</strong>
                                <small>Används för relevanta annonser</small>
                            </span>
                            <input type="checkbox" id="cookie-marketing">
                            <span class="toggle-slider"></span>
                        </label>
                    </div>

                    <div class="cookie-actions">
                        <button class="cookie-btn cookie-btn-reject" id="cookie-reject">Avvisa alla</button>
                        <button class="cookie-btn cookie-btn-settings" id="cookie-settings">Inställningar</button>
                        <button class="cookie-btn cookie-btn-accept" id="cookie-accept">Godkänn alla</button>
                    </div>
                    
                    <div class="cookie-save-row" id="cookie-save-row" style="display:none;">
                        <button class="cookie-btn cookie-btn-accept" id="cookie-save">Spara mina val</button>
                    </div>

                    <a href="integritetspolicy.html#section-8" class="cookie-policy-link">Läs mer i vår integritetspolicy</a>
                </div>
            </div>
        `;

        document.body.appendChild(overlay);

        // Event listeners
        document.getElementById('cookie-accept').addEventListener('click', () => {
            saveConsent({ analytics: true, marketing: true });
            closeBanner();
        });

        document.getElementById('cookie-reject').addEventListener('click', () => {
            saveConsent({ analytics: false, marketing: false });
            closeBanner();
        });

        document.getElementById('cookie-settings').addEventListener('click', () => {
            const cats = document.getElementById('cookie-categories');
            const saveRow = document.getElementById('cookie-save-row');
            const settingsBtn = document.getElementById('cookie-settings');
            
            if (cats.style.display === 'none') {
                cats.style.display = 'flex';
                saveRow.style.display = 'flex';
                settingsBtn.textContent = 'Dölj inställningar';
            } else {
                cats.style.display = 'none';
                saveRow.style.display = 'none';
                settingsBtn.textContent = 'Inställningar';
            }
        });

        document.getElementById('cookie-save').addEventListener('click', () => {
            saveConsent({
                analytics: document.getElementById('cookie-analytics').checked,
                marketing: document.getElementById('cookie-marketing').checked
            });
            closeBanner();
        });

        // Animate in
        requestAnimationFrame(() => {
            overlay.classList.add('visible');
        });
    }

    function closeBanner() {
        const overlay = document.getElementById('cookie-overlay');
        if (overlay) {
            overlay.classList.remove('visible');
            overlay.classList.add('closing');
            setTimeout(() => overlay.remove(), 350);
        }
    }

    // ─── Public: re-open banner ─────────────────────────────
    window.openCookieSettings = function () {
        localStorage.removeItem(CONSENT_KEY);
        // Remove existing if any
        const existing = document.getElementById('cookie-overlay');
        if (existing) existing.remove();
        createBanner();

        // Pre-fill current preferences
        const consent = getConsent();
        if (consent) {
            document.getElementById('cookie-analytics').checked = consent.analytics;
            document.getElementById('cookie-marketing').checked = consent.marketing;
        }
    };

    // ─── Init ───────────────────────────────────────────────
    function init() {
        // Wire up footer "Cookiehantering" links
        document.querySelectorAll('a[href="#cookie-settings"]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                window.openCookieSettings();
            });
        });

        // Show banner if no consent stored
        if (!getConsent()) {
            createBanner();
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
