import i18n from "i18next";
import { initReactI18next } from "react-i18next";

i18n
  .use(initReactI18next) // ✅ tell React to use i18n
  .init({
    resources: {
      en: {
        translation: {
          home: "Home",
          donate: "Donate",
          history: "Transaction History",
          volunteer: "Volunteer",
          jobs: "Jobs",
          login: "Login",
          logout: "Logout",
        },
      },
      hi: {
        translation: {
          home: "होम",
          donate: "दान करें",
          history: "लेनदेन इतिहास",
          volunteer: "स्वयंसेवक",
          jobs: "नौकरियां",
          login: "लॉगिन",
          logout: "लॉगआउट",
        },
      },
      pa: {
        translation: {
          home: "ਘਰ",
          donate: "ਦਾਨ ਕਰੋ",
          history: "ਲੈਣ-ਦੇਣ ਇਤਿਹਾਸ",
          volunteer: "ਸੇਵਾ",
          jobs: "ਨੌਕਰੀਆਂ",
          login: "ਲੌਗਇਨ",
          logout: "ਲੌਗਆਉਟ",
        },
      },
    },
    lng: "en", // default language
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;