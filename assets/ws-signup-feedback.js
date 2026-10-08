(() => {
  const storageKey = 'whitetail-signup-source';
  document.addEventListener('submit', (event) => {
    const form = event.target;
    if (!(form instanceof HTMLFormElement)) return;
    let source = null;
    if (form.id === 'RutLine') source = 'rut';
    else if (form.id === 'WsCommunity') source = 'community';
    else if (form.classList.contains('email-signup__form')) source = 'footer';
    if (!source) return;
    try { sessionStorage.setItem(storageKey, source); } catch (_) {}
  }, true);
  document.addEventListener('DOMContentLoaded', () => {
    let lastSource = null;
    try {
      lastSource = sessionStorage.getItem(storageKey);
      sessionStorage.removeItem(storageKey);
    } catch (_) {}
    if (!lastSource) return;
    document.querySelectorAll('[data-ws-signup-feedback]').forEach((message) => {
      if (message.dataset.wsSignupFeedback !== lastSource) {
        message.hidden = true;
      }
    });
  });
})();
