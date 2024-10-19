const tableContainer = document.querySelector('.table-container');
const pokerTableImage = document.querySelector('.poker-table-image');
const guessContainer = document.querySelector('.guess-container');
const feedbackElement = document.createElement('div'); // Create a feedback element
const timerElement = document.createElement('div'); // Create a timer element

feedbackElement.classList.add('feedback'); // Add feedback class
timerElement.classList.add('timer'); // Add timer class

const allPositionsMap = {
    2: ['Small Blind', 'Big Blind'],
    3: ['Button', 'Small Blind', 'Big Blind'],
    4: ['Button', 'Small Blind', 'Big Blind', 'Under the Gun'],
    5: ['Button', 'Small Blind', 'Big Blind', 'Under the Gun', 'Cutoff'],
    6: ['Button', 'Small Blind', 'Big Blind', 'Under the Gun', 'Hijack', 'Cutoff'],
    7: ['Button', 'Small Blind', 'Big Blind', 'Under the Gun', 'Middle Player', 'Hijack', 'Cutoff'],
    8: ['Button', 'Small Blind', 'Big Blind', 'Under the Gun', 'UTG +1', 'Middle Player', 'Hijack', 'Cutoff'],
    9: ['Button', 'Small Blind', 'Big Blind', 'Under the Gun', 'UTG +1', 'UTG +2', 'Middle Player', 'Hijack', 'Cutoff'],
    10: ['Button', 'Small Blind', 'Big Blind', 'Under the Gun', 'UTG +1', 'UTG +2', 'Middle Player', 'Middle Player 2', 'Hijack', 'Cutoff']
};

// Difficulty levels in seconds
const difficultyLevels = {
    Easy: 10,
    Medium: 7,
    Hard: 4
};

// Track progress
const difficultyProgress = {
    Easy: true,   // Initially unlocked
    Medium: false, // Locked until Easy is completed
    Hard: false,   // Locked until Medium is completed
};

// Initialize game variables
let currentQuestion = 1;
let correctAnswers = 0;
let totalTime = 0;
let timePerQuestion = 0;
let timerInterval; // To store the timer interval
let questionStartTime; // To record the start time of each question
const totalQuestions = 10; // Set the number of questions

document.getElementById('backButton').addEventListener('click', function () {
    window.location.href = 'position.html'; // Redirect to Menu.html
});

function showDifficultySelection() {
    pokerTableImage.style.display = 'none'; // Hide the poker table image
    guessContainer.innerHTML = ''; // Clear any existing content

    const difficultyText = document.createElement('div');
    difficultyText.textContent = 'Select Difficulty:';
    difficultyText.classList.add('difficulty-text');
    guessContainer.appendChild(difficultyText);

    const difficulties = ['Easy', 'Medium', 'Hard'];
    difficulties.forEach(difficulty => {
        const button = document.createElement('button');
        button.textContent = difficulty;
        button.classList.add('difficulty-button');

        // Disable buttons for locked difficulties
        if (!difficultyProgress[difficulty]) {
            button.disabled = true;
            button.classList.add('locked-button'); // Add a class to style disabled buttons differently
        } else {
            button.disabled = false; // Ensure enabled button styles are applied
            button.classList.remove('locked-button');
        }

        button.onclick = () => startGame(difficulty);

        guessContainer.appendChild(button);
    });
}

function startGame(difficulty) {
    pokerTableImage.style.display = 'block'; // Show the poker table image

    // Initialize game variables
    currentQuestion = 1;
    correctAnswers = 0;
    totalTime = 0;

    // Set the timer based on difficulty
    timePerQuestion = difficultyLevels[difficulty];
    setupTable(difficulty);
}

function setupTable(difficulty) {
    // Clear existing player elements
    tableContainer.querySelectorAll('.player').forEach(player => player.remove());

    // Ensure poker table image is displayed
    pokerTableImage.style.display = 'block';

    // Clear existing guess buttons and feedback
    guessContainer.innerHTML = '';
    feedbackElement.textContent = ''; // Clear previous feedback
    feedbackElement.classList.remove('correct', 'incorrect'); // Remove feedback classes

    timerElement.textContent = ''; // Clear previous timer
    guessContainer.appendChild(timerElement); // Add timer element to guessContainer

    // Create and add the question number display element
    const questionNumberElement = document.createElement('div');
    questionNumberElement.classList.add('question-number');
    questionNumberElement.id = 'questionNumber'; // Add an ID for easy access
    questionNumberElement.textContent = `Question ${currentQuestion} of ${totalQuestions}`;
    guessContainer.appendChild(questionNumberElement);

    // Create a container for feedback and buttons
    const buttonWrapper = document.createElement('div');
    buttonWrapper.classList.add('button-wrapper');

    // Append feedback element to button wrapper
    buttonWrapper.appendChild(feedbackElement);
    guessContainer.appendChild(buttonWrapper);

    // Set the size of the poker table image
    pokerTableImage.style.width = '900px'; // Wider
    pokerTableImage.style.height = '500px'; // Less tall
    pokerTableImage.style.position = 'absolute'; // Changed from absolute to relative
    pokerTableImage.style.margin = 'auto'; // Center horizontally

    // Get the dimensions and position of the poker table
    const tableRect = pokerTableImage.getBoundingClientRect();
    const tableCenterX = tableRect.width / 2;
    const tableCenterY = tableRect.height / 2;

    // Determine the number of players
    const numPlayers = Math.floor(Math.random() * 8) + 2; // Random number between 2 and 10
    const playerIndex = Math.floor(Math.random() * numPlayers); // Index for the real player
    const dealerIndex = Math.floor(Math.random() * numPlayers); // Index for the dealer

    // Get available positions based on the number of players
    let availablePositions = allPositionsMap[numPlayers];

    // Store the correct position for feedback
    const correctPosition = availablePositions[(playerIndex - dealerIndex + numPlayers) % numPlayers];

    // Create player elements
    for (let i = 0; i < numPlayers; i++) {
        const playerDiv = document.createElement('div');
        playerDiv.classList.add('player');

        const img = document.createElement('img');
        img.classList.add('position-img');
        img.src = i === playerIndex ? 'images/userGuess.png' : 'images/user.png';

        // Debugging: Check if image is loaded correctly
        img.onload = () => console.log(`Image ${img.src} loaded successfully`);
        img.onerror = () => console.error(`Failed to load image ${img.src}`);

        playerDiv.appendChild(img);

        // Position the players around the table
        const angle = (i * 360 / numPlayers) * (Math.PI / 180); // Calculate angle in radians

        // Radii for the circle to position players around the table edge
        const radiusX = (tableRect.width / 2) - 10; // Adjust for oval shape
        const radiusY = (tableRect.height / 2) - 5; // Adjust for oval shape
        const x = tableCenterX + radiusX * Math.cos(angle) - 25; // Move left by 25 pixels
        const y = tableCenterY + radiusY * Math.sin(angle) - 30; // Move up by 30 pixels

        // Debugging: Log the positions
        console.log(`Player ${i}: X=${x}, Y=${y}`);

        playerDiv.style.position = 'absolute';
        playerDiv.style.left = `${x}px`;
        playerDiv.style.top = `${y}px`;

        tableContainer.appendChild(playerDiv);

        // Add dealer chip
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

    // Create guess buttons for the user
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

function startTimer(difficulty) {
    // Clear any existing timer interval
    if (timerInterval) {
        clearInterval(timerInterval);
    }

    let timeRemaining = timePerQuestion;
    timerElement.textContent = `Time Remaining: ${timeRemaining} seconds`;
    questionStartTime = new Date().getTime(); // Record the start time

    timerInterval = setInterval(() => {
        timeRemaining--;
        timerElement.textContent = `Time Remaining: ${timeRemaining} seconds`;

        if (timeRemaining <= 0) {
            clearInterval(timerInterval);
            feedbackElement.textContent = 'Time\'s up!';
            feedbackElement.classList.add('incorrect');

            // Update total time for time-out case
            const questionEndTime = new Date().getTime();
            totalTime += (questionEndTime - questionStartTime) / 1000; // Convert milliseconds to seconds

            // Move to the next question after showing the "Time's up!" message
            setTimeout(() => {
                if (currentQuestion < totalQuestions) {
                    currentQuestion++;
                    setupTable(difficulty);
                } else {
                    displayResults(difficulty);
                }
            }, 2000);
        }
    }, 1000);
}

function checkPosition(selectedPosition, correctPosition, difficulty) {
    // Stop the timer
    clearInterval(timerInterval);

    const questionEndTime = new Date().getTime();
    const timeTaken = (questionEndTime - questionStartTime) / 1000; // Convert milliseconds to seconds
    totalTime += timeTaken;

    if (selectedPosition === correctPosition) {
        correctAnswers++;
        feedbackElement.textContent = 'Correct!';
        feedbackElement.classList.add('correct');
    } else {
        feedbackElement.textContent = `Incorrect! The correct position was ${correctPosition}.`;
        feedbackElement.classList.add('incorrect');
    }

    // Disable guess buttons
    const buttons = document.querySelectorAll('.guess-button');
    buttons.forEach(button => {
        button.disabled = true;
    });

    // Move to the next question after showing feedback
    setTimeout(() => {
        if (currentQuestion < totalQuestions) {
            currentQuestion++;
            setupTable(difficulty);
        } else {
            displayResults(difficulty);
        }
    }, 2000);
}

function displayResults(difficulty) {
    // Display the results
    pokerTableImage.style.display = 'none'; // Hide the poker table image
    guessContainer.innerHTML = ''; // Clear existing content

    // Hide player images by removing the table container content
    tableContainer.innerHTML = ''; // Clear all player elements

    const resultsElement = document.createElement('div');
    resultsElement.classList.add('results');
    resultsElement.textContent = `Game Over! You got ${correctAnswers} out of ${totalQuestions} correct.`;

    const timeElement = document.createElement('div');
    timeElement.textContent = `Average Time per Question: ${(totalTime / totalQuestions).toFixed(2)} seconds`;

    resultsElement.appendChild(timeElement);
    guessContainer.appendChild(resultsElement);

    // Update difficulty progress
    if (correctAnswers === totalQuestions) {
        difficultyProgress[difficulty] = true; // Mark current difficulty as completed

        // Unlock the next difficulty if applicable
        if (difficulty === 'Easy') {
            difficultyProgress.Medium = true;
        } else if (difficulty === 'Medium') {
            difficultyProgress.Hard = true;
        }
    }

    // Show difficulty selection again after displaying results
    setTimeout(showDifficultySelection, 5000); // Show difficulty selection after 5 seconds
}

// Start the game by showing difficulty selection
showDifficultySelection(); 
