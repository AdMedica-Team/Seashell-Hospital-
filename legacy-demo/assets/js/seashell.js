const root = document.documentElement;
const languageButton = document.getElementById('languageButton');
const menuButton = document.getElementById('menuButton');
const siteNav = document.getElementById('siteNav');
const dialog = document.getElementById('appointmentDialog');
const dialogClose = document.getElementById('dialogClose');
const form = document.getElementById('appointmentForm');
const formMessage = document.getElementById('formMessage');

function setLanguage(language) {
  const arabic = language === 'ar';
  root.lang = language;
  root.dir = arabic ? 'rtl' : 'ltr';
  document.querySelectorAll('[data-en][data-ar]').forEach((element) => {
    element.textContent = arabic ? element.dataset.ar : element.dataset.en;
  });
  languageButton.textContent = arabic ? 'English' : 'عربي';
  localStorage.setItem('seashell-language', language);
}

setLanguage(localStorage.getItem('seashell-language') || 'en');
languageButton.addEventListener('click', () => setLanguage(root.lang === 'ar' ? 'en' : 'ar'));
menuButton.addEventListener('click', () => siteNav.classList.toggle('open'));
siteNav.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => siteNav.classList.remove('open')));

document.querySelectorAll('.faq-item').forEach((item) => item.addEventListener('click', () => { const expanded = item.getAttribute('aria-expanded') === 'true'; item.setAttribute('aria-expanded', String(!expanded)); item.classList.toggle('open', !expanded); }));
document.querySelectorAll('[data-book]').forEach((button) => button.addEventListener('click', () => dialog.showModal()));
dialogClose.addEventListener('click', () => dialog.close());
dialog.addEventListener('click', (event) => { if (event.target === dialog) dialog.close(); });
form.addEventListener('submit', (event) => {
  event.preventDefault();
  const values = Object.fromEntries(new FormData(form));
  const phoneOk = /^\+?[0-9\s-]{8,20}$/.test(values.phone);
  const arabic = root.lang === 'ar';
  if (!phoneOk) {
    formMessage.textContent = arabic ? 'يرجى إدخال رقم هاتف صحيح.' : 'Please enter a valid phone number.';
    return;
  }
  formMessage.textContent = arabic ? 'تم استلام طلبك وسيتواصل معك فريق المواعيد.' : 'Your request was received. Our appointments team will contact you.';
  form.reset();
});
