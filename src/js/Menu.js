window.onload = function () {
    // Handle startButton click
    const startButton = document.getElementById('startButton');
    if (startButton) {
        startButton.addEventListener('click', () => {
            console.log('Button clicked!');
        });
    } else {
        console.error('Element #startButton not found');
    }

    // Handle trainBtn click and toggle train options
    const trainBtn = document.getElementById('train-btn');
    const trainOptions = document.querySelector('.train-options');

    if (trainBtn && trainOptions) {
        trainBtn.addEventListener('click', function () {
            trainOptions.classList.toggle('show');
        });
    } else {
        console.error('Element #train-btn or .train-options not found');
    }

    // Handle cards button redirection
    const cardsBtn = document.getElementById('cards-btn');
    if (cardsBtn) {
        cardsBtn.addEventListener('click', function () {
            window.location.href = 'cards.html';
        });
    } else {
        console.error('Element #cards-btn not found');
    }

    // Handle chips button redirection
    const chipsBtn = document.getElementById('chips-btn');
    if (chipsBtn) {
        chipsBtn.addEventListener('click', function () {
            window.location.href = 'chips.html';
        });
    } else {
        console.error('Element #chips-btn not found');
    }

    // Handle position button redirection
    const positionBtn = document.getElementById('position-btn');
    if (positionBtn) {
        positionBtn.addEventListener('click', function () {
            window.location.href = 'position.html';
        });
    } else {
        console.error('Element #position-btn not found');
    }
};
