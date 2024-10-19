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
const difficultyProgress = JSON.parse(localStorage.getItem('difficultyProgress')) || {
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
    window.location.href = 'game.html'; // Redirect to Menu.html
});

function startGame(difficulty) {
    const pokerTableImage = document.querySelector('.poker-table-image');

    if (!pokerTableImage) {
        console.error('Poker table image element not found');
        return;
    }

    pokerTableImage.style.display = 'block'; // Show the poker table image


    // Initialize game variables
    currentQuestion = 1;
    correctAnswers = 0;
    totalTime = 0;

    // Set the timer based on difficulty
    timePerQuestion = difficultyLevels[difficulty];
    setupTable(difficulty);
}

// Function to save progress
function unlockNextDifficulty(currentDifficulty) {
    const difficultyOrder = ['Easy', 'Medium', 'Hard'];
    const currentIndex = difficultyOrder.indexOf(currentDifficulty);
    console.log(`Current Index: ${currentIndex}`);

    if (currentIndex < difficultyOrder.length - 1) {
        const nextDifficulty = difficultyOrder[currentIndex + 1];
        difficultyProgress[nextDifficulty] = true; // Unlock next difficulty
        console.log(`Unlocked ${nextDifficulty} mode! Current Progress: ${JSON.stringify(difficultyProgress)}`);
        saveDifficultyProgress();
    }
}

function saveDifficultyProgress() {
    console.log(`Saving progress to local storage:`, JSON.stringify(difficultyProgress));
    localStorage.setItem('difficultyProgress', JSON.stringify(difficultyProgress));
    console.log('Progress saved. Current state in localStorage:', localStorage.getItem('difficultyProgress'));
}
function setupTable(difficulty) {
    // First, clear any existing players and their labels to start fresh
    tableContainer.querySelectorAll('.seat-label').forEach(player => player.remove());

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
    pokerTableImage.style.position = 'relative'; // Changed from absolute to relative
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
        img.src = i === playerIndex ? 'assets/img/userGuess.png' : 'assets/img/user.png';

        // Set fixed dimensions for player images
        img.style.width = '60px';
        img.style.height = '60px';

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

        // Determine the correct seat label based on the dealer's position
        const adjustedIndex = (i - dealerIndex + numPlayers) % numPlayers;
        const seatPosition = availablePositions[adjustedIndex];

        // Create and position the seat label
        const seatLabel = document.createElement('div');
        seatLabel.classList.add('seat-label');
        seatLabel.textContent = seatPosition;
        seatLabel.style.position = 'absolute';
        seatLabel.style.top = `${y - 20}px`;  // Adjust the top position to sit above the player
        seatLabel.style.left = `${x + 30}px`; // Adjust the left position to align with the player image
        seatLabel.style.transform = 'translate(-50%, -100%)'; // Correct centering
        seatLabel.style.display = 'none'; // Initially hidden

        tableContainer.appendChild(seatLabel);

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

    // Immediately hide previous labels to ensure they are not visible in the next feedback
    tableContainer.querySelectorAll('.seat-label').forEach(label => label.style.display = 'none');

    //Logic to check the user guess
    if (selectedPosition === correctPosition) {
        feedbackElement.textContent = 'Correct!';
        feedbackElement.classList.add('correct');
        correctAnswers++;
    } else {
        feedbackElement.textContent = `Incorrect. The correct position was: ${correctPosition}`;
        feedbackElement.classList.add('incorrect');
    }

    // Show the seat labels
    tableContainer.querySelectorAll('.seat-label').forEach(label => {
        label.style.display = 'block'; // Show all labels
    });

    // Update total time for each question
    const questionEndTime = new Date().getTime();
    totalTime += (questionEndTime - questionStartTime) / 1000; // Convert milliseconds to seconds

    // Move to the next question after a short delay
    setTimeout(() => {
        // Hide labels after feedback before next question setup
        tableContainer.querySelectorAll('.seat-label').forEach(label => label.style.display = 'none');

        if (currentQuestion < totalQuestions) {
            currentQuestion++;
            setupTable(difficulty);
        } else {
            displayResults(difficulty);
        }
    }, 2000);
}


function displayResults(difficulty) {
    // Hide the poker table image
    pokerTableImage.style.display = 'none';

    // Clear the table container to remove player images
    tableContainer.innerHTML = '';

    // Clear the guess container to remove previous buttons, timer, and question number
    guessContainer.innerHTML = '';

    // Show results
    const results = document.createElement('div');
    results.classList.add('results');
    results.innerHTML = `
        <h2>Game Over</h2>
        <p>You got ${correctAnswers} out of ${totalQuestions} questions correct.</p>
        <p>Total Time: ${totalTime.toFixed(2)} seconds.</p>
    `;
    guessContainer.appendChild(results);

    // Unlock next difficulty level if all answers are correct
    if (correctAnswers === totalQuestions) {
        unlockNextDifficulty(difficulty);
        saveDifficultyProgress(); // Save progress to localStorage
        setTimeout(() => {
            window.location.href = 'game.html'; // Redirect to difficulty selection page
        }, 3000); // Wait for 3 seconds before redirecting
    } else {
        // Add a "Play Again" button if the user did not answer all correctly
        const playAgainButton = document.createElement('button');
        playAgainButton.textContent = 'Play Again';
        playAgainButton.onclick = () => startGame(difficulty);
        guessContainer.appendChild(playAgainButton);

        // Add a "Back" button
        const backButton = document.createElement('button');
        backButton.textContent = 'Back';
        backButton.onclick = () => window.location.href = 'game.html'; // Adjust the link as needed
        guessContainer.appendChild(backButton);
    }


    function unlockNextDifficulty(currentDifficulty) {
        const difficultyOrder = ['Easy', 'Medium', 'Hard'];
        const currentIndex = difficultyOrder.indexOf(currentDifficulty);

        if (currentIndex < difficultyOrder.length - 1) {
            const nextDifficulty = difficultyOrder[currentIndex + 1];
            difficultyProgress[nextDifficulty] = true; // Unlock next difficulty
            console.log(`Unlocked ${nextDifficulty} mode!`);
        }
    }

    saveDifficultyProgress();
    console.log('Stored in localStorage:', localStorage.getItem('difficultyProgress'));
}