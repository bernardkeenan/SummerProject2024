// This function is called when the DOM content is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    const easyButton = document.getElementById('easyButton');
    const mediumButton = document.getElementById('mediumButton');
    const hardButton = document.getElementById('hardButton');

    // Initialize difficulty status and check button states
    initializeDifficultyStatus();
    checkDifficultyUnlock();

    // Add event listeners for buttons
    if (easyButton) {
        easyButton.addEventListener('click', () => {
            localStorage.setItem('selectedDifficulty', 'easy');
            window.location.href = 'hCqEasy.html'; // Redirect to easy quiz page
        });
    }

    if (mediumButton) {
        mediumButton.addEventListener('click', () => {
            localStorage.setItem('selectedDifficulty', 'medium');
            window.location.href = 'hCqMedium.html'; // Redirect to medium quiz page
        });
    }

    if (hardButton) {
        hardButton.addEventListener('click', () => {
            localStorage.setItem('selectedDifficulty', 'hard');
            window.location.href = 'hCqHard.html'; // Redirect to hard quiz page
        });
    }
});

// Initialize difficulty completion in localStorage if not set
function initializeDifficultyStatus() {
    const completedDifficulty = localStorage.getItem('completedDifficulty');
    console.log('Initialized completedDifficulty:', completedDifficulty); // Debugging output

    if (!completedDifficulty) {
        localStorage.setItem('completedDifficulty', 'easy');
        console.log('Set completedDifficulty to easy');
    }
}

// Update button states based on completed difficulty
function checkDifficultyUnlock() {
    const completedDifficulty = localStorage.getItem('completedDifficulty') || 'easy';
    console.log('Checking difficulty unlock:', completedDifficulty); // Debugging output

    const mediumButton = document.getElementById('mediumButton');
    const hardButton = document.getElementById('hardButton');

    if (mediumButton) {
        mediumButton.disabled = completedDifficulty !== 'easy';
        console.log('Medium button disabled:', mediumButton.disabled); // Debugging output
    }

    if (hardButton) {
        hardButton.disabled = completedDifficulty !== 'medium';
        console.log('Hard button disabled:', hardButton.disabled); // Debugging output
    }
}
