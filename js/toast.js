/* ========================================
   CLEANSWEEP - Toast Notification System
   ======================================== */

/**
 * showToast(message, type)
 * 
 * Displays a slide-in notification popup.
 * @param {string} message - The text to display
 * @param {'success'|'error'|'info'} type - Toast style variant
 */
function showToast(message, type = 'info') {
  // Create container if it doesn't exist
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }

  // Create toast element
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;

  // Icon per type
  const icons = {
    success: '✓',
    error: '✕',
    info: 'ℹ'
  };

  toast.innerHTML = `
    <span class="toast-icon">${icons[type] || icons.info}</span>
    <span class="toast-message">${message}</span>
    <button class="toast-close" aria-label="Close">✕</button>
  `;

  // Close button handler
  toast.querySelector('.toast-close').addEventListener('click', () => {
    dismissToast(toast);
  });

  // Append and trigger entrance animation
  container.appendChild(toast);

  // Force reflow before adding show class for animation
  toast.offsetHeight;
  toast.classList.add('show');

  // Auto-dismiss after 3 seconds
  setTimeout(() => {
    dismissToast(toast);
  }, 3000);
}

/**
 * Smoothly removes a toast element
 */
function dismissToast(toast) {
  if (!toast || toast.classList.contains('dismissing')) return;
  toast.classList.add('dismissing');
  toast.classList.remove('show');
  toast.addEventListener('transitionend', () => {
    toast.remove();
  }, { once: true });
}
