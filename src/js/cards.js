document.addEventListener('DOMContentLoaded', function () {
    const mainBtn = document.getElementById('cards-btn');
    const trainOptions = document.querySelector('.train-options');
    const backBtn = document.getElementById('back-btn');

    // Toggle visibility of the training options
    mainBtn.addEventListener('click', function () {
        trainOptions.classList.toggle('show');
    });

    // Back to Menu functionality
    backBtn.addEventListener('click', function () {
        window.location.href = 'menu.html'; // Redirect to the menu page
    });

    // Redirect to HandRecognition.html
    document.getElementById('option1-btn').addEventListener('click', function () {
        window.location.href = 'HandRecognition.html';
    });

    // Redirect to hCqDifficultySelector.html
    document.getElementById('option2-btn').addEventListener('click', function () {
        window.location.href = 'hCqDifficultySelector.html';
    });
});
