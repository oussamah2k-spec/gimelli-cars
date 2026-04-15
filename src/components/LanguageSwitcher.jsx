import { useEffect, useState } from 'react';

const LANGUAGES = [
  { code: 'AR', label: 'العربية', flag: '🇲🇦' },
  { code: 'FR', label: 'Français', flag: '🇫🇷' },
  { code: 'EN', label: 'English', flag: '🇺🇸' },
];

function getInitialLanguage() {
  if (typeof window === 'undefined') {
    return 'EN';
  }

  return window.localStorage.getItem('client2-language') || 'EN';
}

function LanguageSwitcher() {
  const [lang, setLang] = useState(getInitialLanguage);

  useEffect(() => {
    window.localStorage.setItem('client2-language', lang);
    document.documentElement.lang = lang.toLowerCase();
    document.documentElement.dir = lang === 'AR' ? 'rtl' : 'ltr';
  }, [lang]);

  return (
    <div className="language-switcher" role="group" aria-label="Language switcher">
      {LANGUAGES.map((language) => (
        <button
          key={language.code}
          type="button"
          className={`language-switcher__button ${lang === language.code ? 'is-active' : ''}`}
          onClick={() => setLang(language.code)}
        >
          <span className="language-switcher__flag" aria-hidden="true">
            {language.flag}
          </span>
          <span>{language.label}</span>
        </button>
      ))}
    </div>
  );
}

export default LanguageSwitcher;
