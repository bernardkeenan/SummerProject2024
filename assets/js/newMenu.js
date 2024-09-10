document.addEventListener('DOMContentLoaded', function () {
    const trainBtn = document.getElementById('train-btn');
    const trainOptions = document.querySelector('.train-options');

    trainBtn.addEventListener('click', function () {
        // Toggle the visibility of the training options
        trainOptions.classList.toggle('show');
    });
});
