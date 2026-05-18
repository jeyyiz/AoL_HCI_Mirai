const filterButtons = document.querySelectorAll('.filter-btn');
if (filterButtons.length > 0) {
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const activeBtn = document.querySelector('.filter-btn.active');
            if (activeBtn) activeBtn.classList.remove('active');
            button.classList.add('active');

            const filterValue = button.getAttribute('data-filter');
            const cards = document.querySelectorAll('.therapist-card');
            let visibleCount = 0;

            cards.forEach(card => {
                const region = card.getAttribute('data-region');
                if (filterValue === 'all' || filterValue === region) {
                    card.style.display = 'block';
                    visibleCount++;
                } else {
                    card.style.display = 'none';
                }
            });

            const countEl = document.getElementById('count');
            if (countEl) countEl.textContent = visibleCount;
        });
    });
}