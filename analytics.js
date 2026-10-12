// Лабораторная работа №7: Google Analytics 4 + опциональная Яндекс.Метрика.
// GA4 ID подтверждён скриншотом настроек веб-потока.
const GA4_ID = 'G-PP06V3F9L0';
// После восстановления Яндекс.Метрики замените 0 на номер своего счётчика.
const YANDEX_METRIKA_ID = 0;
const CONSENT_KEY = 'codestart_lab7_analytics_consent';

function enableGoogleAnalytics(){
  if (window.__ga4Started) return;
  window.__ga4Started = true;
  window.dataLayer = window.dataLayer || [];
  window.gtag = function(){ window.dataLayer.push(arguments); };
  window.gtag('js', new Date());
  window.gtag('config', GA4_ID);
  const script = document.createElement('script');
  script.async = true;
  script.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(GA4_ID);
  document.head.appendChild(script);
  // Событие-конверсия: посещение contacts.html после согласия.
  if (window.location.pathname.endsWith('/contacts.html')) {
    window.gtag('event', 'contact_page_view', {
      page_path: window.location.pathname,
      page_title: document.title
    });
  }
}
function enableYandexMetrika(){
  const id = Number(YANDEX_METRIKA_ID);
  if (!Number.isSafeInteger(id) || id <= 0 || window.__metrikaStarted) return;
  window.__metrikaStarted = true;
  (function(m,e,t,r,i,k,a){
    m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
    m[i].l=1*new Date();
    k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a);
  })(window,document,'script','https://mc.yandex.ru/metrika/tag.js','ym');
  window.ym(id,'init',{clickmap:true,trackLinks:true,accurateTrackBounce:true});
  // Цель Яндекс.Метрики настраивается как URL-условие: содержит contacts.html.
}
function initializeAnalytics(){
  enableGoogleAnalytics();
  enableYandexMetrika();
}
function updateConsentUi(){
  const value=localStorage.getItem(CONSENT_KEY);
  const banner=document.getElementById('consentBanner');
  const status=document.getElementById('consentStatus');
  if(banner)banner.classList.toggle('active',value===null);
  if(status)status.textContent=value==='accepted'?'Аналитика разрешена':value==='declined'?'Аналитика отключена':'Решение ещё не выбрано';
}
document.addEventListener('DOMContentLoaded',()=>{
  document.getElementById('acceptAnalytics')?.addEventListener('click',()=>{
    localStorage.setItem(CONSENT_KEY,'accepted');
    initializeAnalytics();
    updateConsentUi();
  });
  document.getElementById('declineAnalytics')?.addEventListener('click',()=>{
    localStorage.setItem(CONSENT_KEY,'declined');
    updateConsentUi();
  });
  document.getElementById('changeConsent')?.addEventListener('click',()=>{
    localStorage.removeItem(CONSENT_KEY);
    window.location.reload();
  });
  if(localStorage.getItem(CONSENT_KEY)==='accepted')initializeAnalytics();
  updateConsentUi();
});
