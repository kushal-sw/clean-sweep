document.addEventListener('DOMContentLoaded', () => {
    // State
    let selectionMode = 'multiple'; // 'single' or 'multiple'
    let selectedDates = []; // store selected dates
    const maxMultipleDates = 5;

    // Elements
    const tabs = document.querySelectorAll('.tab-btn');
    const calCells = document.querySelectorAll('.cal-cell:not(.empty)');
    const continueBtn = document.querySelector('.continue-btn');

    // Tab switching logic
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            // Update mode based on text content
            selectionMode = tab.textContent.trim().toLowerCase();

            // Reset selections on tab switch
            selectedDates = [];
            updateCalendarUI();
            checkPayButton();
        });
    });

    // Date selection logic
    calCells.forEach(cell => {
        cell.addEventListener('click', () => {
            // Get date value (handling the 'today' span gracefully if present)
            const dateText = cell.childNodes.length > 1 ? cell.childNodes[1].textContent.trim() : cell.textContent.trim();
            const dateValue = parseInt(dateText, 10);

            if (selectionMode === 'single') {
                // Single Mode: just replace selection
                selectedDates = [dateValue];
            } else {
                // Multiple Mode: toggle selection
                const index = selectedDates.indexOf(dateValue);
                if (index > -1) {
                    // Deselect if already selected
                    selectedDates.splice(index, 1);
                } else {
                    // Select if under max limit
                    if (selectedDates.length < maxMultipleDates) {
                        selectedDates.push(dateValue);
                    } else {
                        // Optional: Could trigger a toast notification here
                        showToast('Maximum 5 dates can be selected at once', 'info');
                    }
                }
            }

            updateCalendarUI();
            checkPayButton();
        });
    });

    function updateCalendarUI() {
        calCells.forEach(c => {
            const cText = c.childNodes.length > 1 ? c.childNodes[1].textContent.trim() : c.textContent.trim();
            const cVal = parseInt(cText, 10);

            if (selectedDates.includes(cVal)) {
                c.style.background = 'var(--pink)';
                c.style.color = '#fff';
                c.style.borderColor = 'var(--pink)';
            } else {
                // Reset inline styles to let external CSS handle appearance
                c.style.background = '';
                c.style.color = '';
                c.style.borderColor = '';
            }
        });
    }

    function checkPayButton() {
        let isValid = false;
        if (selectionMode === 'single') {
            isValid = selectedDates.length === 1;
        } else {
            isValid = selectedDates.length >= 2;
        }

        if (isValid) {
            continueBtn.classList.add('ready');
            continueBtn.style.opacity = '1';
            continueBtn.style.pointerEvents = 'auto';
        } else {
            continueBtn.classList.remove('ready');
            continueBtn.style.opacity = '0.5';
            continueBtn.style.pointerEvents = 'none';
        }
    }

    // Initial Check
    checkPayButton();

    // Store selection before navigation
    if (continueBtn) {
        continueBtn.addEventListener('click', (e) => {
            if (continueBtn.classList.contains('ready')) {
                // Sort dates just in case
                const sortedDates = [...selectedDates].sort((a, b) => a - b);
                sessionStorage.setItem('cs_selectedDates', JSON.stringify(sortedDates));
                sessionStorage.setItem('cs_selectionMode', selectionMode);
            } else {
                e.preventDefault();
            }
        });
    }
});

// Basic Toast function if toast.js isn't loaded globally here
function showToast(message, type = 'info') {
    if (typeof window.showToast === 'function') {
        window.showToast(message, type);
    } else {
        alert(message);
    }
}
