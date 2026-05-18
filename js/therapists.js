const allCards = document.querySelectorAll('.therapist-card');
const countEl = document.getElementById('count');
if (countEl) countEl.textContent = allCards.length;
