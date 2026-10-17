const KEY = 'au-chalet:enfants';

/**
 * Bascule du mode enfants. Le choix est mémorisé sur l'appareil
 * (une tablette d'enfant reste en mode enfants).
 */
export function initKidsToggle() {
  document.querySelectorAll<HTMLButtonElement>('[data-kids-toggle]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const on = btn.dataset.kidsToggle === 'on';
      btn.setAttribute('aria-pressed', String(on));
      try {
        localStorage.setItem(KEY, on ? '1' : '0');
      } catch {
        /* stockage indisponible : on navigue quand même */
      }
      setTimeout(() => location.assign(on ? '/enfants/' : '/'), 180);
    });
  });
}
