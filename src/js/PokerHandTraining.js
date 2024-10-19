function startGame(difficulty) {
    pokerTableImage.style.display = 'block'; // Ensure the poker table image is shown

    // Initialize game variables
    currentQuestion = 1;
    correctAnswers = 0;
    totalTime = 0;

    // Clear any existing player elements to reset positions
    tableContainer.innerHTML = '';

    // Set the timer based on difficulty
    timePerQuestion = difficultyLevels[difficulty];
    setupTable(difficulty);
}

function setupTable(difficulty) {
    // Clear existing player elements
    tableContainer.innerHTML = '';

    // Ensure poker table image is displayed and positioned correctly
    pokerTableImage.style.display = 'block';
    pokerTableImage.style.position = 'relative';
    pokerTableImage.style.margin = 'auto';

    // Clear existing guess buttons and feedback
    guessContainer.innerHTML = '';
    feedbackElement.textContent = ''; // Clear previous feedback
    feedbackElement.classList.remove('correct', 'incorrect'); // Reset feedback styles

    // Reset timer display and append to guess container
    timerElement.textContent = '';
    guessContainer.appendChild(timerElement);

    // Create and add the question number display
    const questionNumberElement = document.createElement('div');
    questionNumberElement.classList.add('question-number');
    questionNumberElement.textContent = `Question ${currentQuestion} of ${totalQuestions}`;
    guessContainer.appendChild(questionNumberElement);

    // Create container for feedback and guess buttons
    const buttonWrapper = document.createElement('div');
    buttonWrapper.classList.add('button-wrapper');
    buttonWrapper.appendChild(feedbackElement);
    guessContainer.appendChild(buttonWrapper);

    // Calculate table center and positioning
    const tableRect = pokerTableImage.getBoundingClientRect();
    const tableCenterX = tableRect.width / 2;
    const tableCenterY = tableRect.height / 2;

    // Determine the number of players and their positions
    const numPlayers = Math.floor(Math.random() * 8) + 2;
    const playerIndex = Math.floor(Math.random() * numPlayers);
    const dealerIndex = Math.floor(Math.random() * numPlayers);

    const availablePositions = allPositionsMap[numPlayers];
    const correctPosition = availablePositions[(playerIndex - dealerIndex + numPlayers) % numPlayers];

    // Place players around the table
    for (let i = 0; i < numPlayers; i++) {
        const playerDiv = document.createElement('div');
        playerDiv.classList.add('player');

        const img = document.createElement('img');
        img.classList.add('position-img');
        img.src = i === playerIndex ? 'assets/images/userGuess.png' : 'assets/images/user.png';

        playerDiv.appendChild(img);

        const angle = (i * 360 / numPlayers) * (Math.PI / 180);
        const radiusX = (tableRect.width / 2) - 10;
        const radiusY = (tableRect.height / 2) - 5;
        const x = tableCenterX + radiusX * Math.cos(angle) - 25;
        const y = tableCenterY + radiusY * Math.sin(angle) - 30;

        playerDiv.style.position = 'absolute';
        playerDiv.style.left = `${x}px`;
        playerDiv.style.top = `${y}px`;

        tableContainer.appendChild(playerDiv);

        if (i === dealerIndex) {
            const chipDiv = document.createElement('div');
            chipDiv.classList.add('chip');
            chipDiv.textContent = 'Button';
            chipDiv.style.position = 'absolute';
            chipDiv.style.top = '50%';
            chipDiv.style.left = '50%';
            chipDiv.style.transform = 'translate(-50%, -50%)';
            playerDiv.appendChild(chipDiv);
        }
    }

    // Create guess buttons
    availablePositions.forEach((position) => {
        const button = document.createElement('button');
        button.textContent = position;
        button.classList.add('guess-button');
        button.onclick = () => checkPosition(position, correctPosition, difficulty);
        buttonWrapper.appendChild(button);
    });

    // Start the timer for the current question
    startTimer(difficulty);
}

function displayResults(difficulty) {
    // Hide the poker table image and remove player images
    pokerTableImage.style.display = 'none';
    tableContainer.innerHTML = ''; // Clear all player elements

    guessContainer.innerHTML = ''; // Clear existing content

    const resultsElement = document.createElement('div');
    resultsElement.classList.add('results');
    resultsElement.textContent = `Game Over! You got ${correctAnswers} out of ${totalQuestions} correct.`;

    const timeElement = document.createElement('div');
    timeElement.textContent = `Average Time per Question: ${(totalTime / totalQuestions).toFixed(2)} seconds`;

    resultsElement.appendChild(timeElement);
    guessContainer.appendChild(resultsElement);

    if (correctAnswers === totalQuestions) {
        difficultyProgress[difficulty] = true;
        if (difficulty === 'Easy') difficultyProgress.Medium = true;
        else if (difficulty === 'Medium') difficultyProgress.Hard = true;
    }

    setTimeout(showDifficultySelection, 5000); // Show difficulty selection after 5 seconds
}
