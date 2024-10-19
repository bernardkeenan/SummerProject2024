document.addEventListener('DOMContentLoaded', function () {
    const mainBtn = document.getElementById('chips-btn');  // Main button for Chips page
    const trainOptions = document.querySelector('.train-options');
    const backBtn = document.getElementById('back-btn');  // Back button

    // Show/Hide the additional buttons when the main button is clicked
    mainBtn.addEventListener('click', function () {
        trainOptions.classList.toggle('show');
    });

    // Back to Menu functionality
    backBtn.addEventListener('click', function () {
        window.location.href = 'menu.html'; // Redirect to the menu page
    });

    // Redirect to BigBlindTraining.html
    document.getElementById('option1-btn').addEventListener('click', function () {
        window.location.href = 'BigBlindTraining.html';
    });

    // Redirect to mScoreTraining.html
    document.getElementById('option2-btn').addEventListener('click', function () {
        window.location.href = 'mScoreTraining.html';
    });

    // Redirect to EffectiveM.html
    document.getElementById('option3-btn').addEventListener('click', function () {
        window.location.href = 'EffectiveM.html';
    });
});
