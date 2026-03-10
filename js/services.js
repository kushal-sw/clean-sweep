// Page transition loader — auto-hide after 1.2s
document.addEventListener('DOMContentLoaded', () => {
    const pageLoader = document.getElementById('page-loader');
    if (pageLoader) {
        setTimeout(() => {
            pageLoader.classList.add('fade-out');
            document.body.classList.remove('page-loading');
            pageLoader.addEventListener('transitionend', () => {
                pageLoader.remove();
            }, { once: true });
        }, 1200);
    }
});
