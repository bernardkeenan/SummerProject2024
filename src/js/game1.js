document.addEventListener('DOMContentLoaded', () => {
    updateButtonStates();  // Call this function on initial load

    // Event handlers for difficulty selection
    document.getElementById('easyButton').addEventListener('click', () => {
        window.location.href = 'easy.html';
    });

    document.getElementById('mediumButton').addEventListener('click', () => {
        if (document.getElementById('mediumButton').disabled) {
            alert('Complete Easy mode to unlock Medium mode!');
        } else {
            window.location.href = 'medium.html';
        }
    });

    document.getElementById('hardButton').addEventListener('click', () => {
        if (document.getElementById('hardButton').disabled) {
            alert('Complete Medium mode to unlock Hard mode!');
        } else {
            window.location.href = 'hard.html';
        }
    });

    document.getElementById('backButton').addEventListener('click', () => {
        window.location.href = 'Menu.html';
    });
});

function updateButtonStates() {
    const difficultyProgress = JSON.parse(localStorage.getItem('difficultyProgress')) || {
        Easy: true,   // Easy is always accessible
        Medium: false,
        Hard: false
    };

    document.getElementById('mediumButton').disabled = !difficultyProgress.Medium;
    document.getElementById('hardButton').disabled = !difficultyProgress.Hard;

    console.log('Button states updated:', difficultyProgress);
}
