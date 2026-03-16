document.addEventListener('DOMContentLoaded', () => {
    
    let selectionMode = 'multiple'; 
    let selectedDates = []; 
    const maxMultipleDates = 5;

    
    const tabs = document.querySelectorAll('.tab-btn');
    const calCells = document.querySelectorAll('.cal-cell:not(.empty)');
    const continueBtn = document.querySelector('.continue-btn');

    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            
            selectionMode = tab.textContent.trim().toLowerCase();

            
            selectedDates = [];
            updateCalendarUI();
            checkPayButton();
        });
    });

    
    calCells.forEach(cell => {
        cell.addEventListener('click', () => {
            
            const dateText = cell.childNodes.length > 1 ? cell.childNodes[1].textContent.trim() : cell.textContent.trim();
            const dateValue = parseInt(dateText, 10);

            if (selectionMode === 'single') {
                
                selectedDates = [dateValue];
            } else {
                
                const index = selectedDates.indexOf(dateValue);
                if (index > -1) {
                    
                    selectedDates.splice(index, 1);
                } else {
                    
                    if (selectedDates.length < maxMultipleDates) {
                        selectedDates.push(dateValue);
                    } else {
                        
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

    
    checkPayButton();

    
    if (continueBtn) {
        continueBtn.addEventListener('click', (e) => {
            if (continueBtn.classList.contains('ready')) {
                
                const sortedDates = [...selectedDates].sort((a, b) => a - b);
                sessionStorage.setItem('cs_selectedDates', JSON.stringify(sortedDates));
                sessionStorage.setItem('cs_selectionMode', selectionMode);
            } else {
                e.preventDefault();
            }
        });
    }
});

function showToast(message, type = 'info') {
    if (typeof window.showToast === 'function') {
        window.showToast(message, type);
    } else {
        alert(message);
    }
}
