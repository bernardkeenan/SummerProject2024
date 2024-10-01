document.addEventListener('DOMContentLoaded', function () {
    const mainBtn = document.getElementById('position-btn');  // Ensure this ID matches your HTML
    const trainOptions = document.querySelector('.train-options');
    const backBtn = document.getElementById('back-btn');  // Ensure this ID matches your HTML

    // Toggle visibility of the training options
    mainBtn.addEventListener('click', function () {
        trainOptions.classList.toggle('show');
    });

    // Back to Menu functionality
    backBtn.addEventListener('click', function () {
        window.location.href = 'menu.html'; // Redirect to the menu page
    });

    // Redirect to SeatNames.html
    document.getElementById('option1-btn').addEventListener('click', function () {
        window.location.href = 'PositionTraining.html';
    });
});
