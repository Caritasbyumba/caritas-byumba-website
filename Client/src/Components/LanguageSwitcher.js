import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { setLanguage } from '../Features/languageSlice';

function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const dispatch = useDispatch();
  const currentLanguage = useSelector(state => state.global.selectedLanguage);
  
  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
    dispatch(setLanguage(lang));
  };
  
  return (
    <div className="language-switcher">
      <button onClick={() => changeLanguage('en')} className={currentLanguage === 'en' ? 'active' : ''}>
        English
      </button>
      <button onClick={() => changeLanguage('fr')} className={currentLanguage === 'fr' ? 'active' : ''}>
        Français
      </button>
      <button onClick={() => changeLanguage('rw')} className={currentLanguage === 'rw' ? 'active' : ''}>
        Kinyarwanda
      </button>
    </div>
  );
}

export default LanguageSwitcher;