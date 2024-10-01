document.addEventListener('DOMContentLoaded', function () {
    const trainBtn = document.getElementById('train-btn');
    const trainOptions = document.querySelector('.train-options');

    trainBtn.addEventListener('click', function () {
        // Toggle the visibility of the training options
        trainOptions.classList.toggle('show');
    });
});

 // Redirection logic for cards, chips, and position buttons
 document.getElementById('cards-btn').addEventListener('click', function () {
    window.location.href = 'cards.html'; // Redirect to cards page
});

document.getElementById('chips-btn').addEventListener('click', function () {
    window.location.href = 'chips.html'; // Redirect to chips page
});

document.getElementById('position-btn').addEventListener('click', function () {
    window.location.href = 'position.html'; // Redirect to position page
});

