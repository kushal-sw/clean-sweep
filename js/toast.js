

function showToast(message, type = 'info') {
  
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    document.body.appendChild(container);
  }

  
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;

  
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

  
  toast.querySelector('.toast-close').addEventListener('click', () => {
    dismissToast(toast);
  });

  
  container.appendChild(toast);

  
  toast.offsetHeight;
  toast.classList.add('show');

  
  setTimeout(() => {
    dismissToast(toast);
  }, 3000);
}

function dismissToast(toast) {
  if (!toast || toast.classList.contains('dismissing')) return;
  toast.classList.add('dismissing');
  toast.classList.remove('show');
  toast.addEventListener('transitionend', () => {
    toast.remove();
  }, { once: true });
}
