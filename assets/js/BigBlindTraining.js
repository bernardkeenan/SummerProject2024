let selectedDifficulty = '';
let timeLimit = 0;
let questionCount = 0;
let correctAnswers = 0;
let totalTime = 0;
let timer = null;
let questionStartTime = 0;
let times = []; // Array to store time for each question

document.getElementById('backButton').addEventListener('click', function () {
    window.location.href = 'Menu.html'; // Redirect to Menu.html
});

// Function to handle difficulty selection
function selectDifficulty(difficulty) {
    if (difficulty === 'easy') {
        selectedDifficulty = 'easy';
        timeLimit = 8;
        document.getElementById('medium').disabled = false;
        document.getElementById('hard').disabled = true;
    } else if (difficulty === 'medium') {
        if (correctAnswers >= 10) {
            selectedDifficulty = 'medium';
            timeLimit = 5;
            document.getElementById('hard').disabled = false;
        } else {
            alert("You need to complete Easy difficulty first.");
            return;
        }
    } else if (difficulty === 'hard') {
        if (correctAnswers >= 10) {
            selectedDifficulty = 'hard';
            timeLimit = 2;
        } else {
            alert("You need to complete Medium difficulty first.");
            return;
        }
    }

    startTraining();
}

// Add event listeners for difficulty buttons
document.getElementById('easy').addEventListener('click', function () {
    selectDifficulty('easy');
});
document.getElementById('medium').addEventListener('click', function () {
    selectDifficulty('medium');
});
document.getElementById('hard').addEventListener('click', function () {
    selectDifficulty('hard');
});

function startTraining() {
    document.getElementById('difficultySelection').style.display = 'none';
    document.getElementById('gameSection').style.display = 'block';
    document.getElementById('resultsSection').style.display = 'none';
    questionCount = 0;
    correctAnswers = 0;
    totalTime = 0;
    times = []; // Reset times array
    nextQuestion();
}

function nextQuestion() {
    if (questionCount >= 10) {
        endTraining();
        return;
    }

    questionCount++;
    document.getElementById('questionCount').innerText = questionCount;
    resetTimer();
    generateQuestion();
}

function generateQuestion() {
    const BB_array = [50, 100, 150, 200, 300, 400, 600, 1000, 1400, 2000, 3000, 4000, 6000, 10000];
    const BB = selectRandomBB(BB_array);
    const chipStack = calculateChipStack(BB);
    const correctAnswer = chipStack / BB;

    document.getElementById('BigBlind').innerText = BB;
    document.getElementById('ChipStack').innerText = chipStack;

    // Store the correct answer for checking later
    document.getElementById('gameSection').dataset.correctAnswer = correctAnswer;

    // Ensure the timer starts only when generating a new question
    questionStartTime = Date.now(); // Start time for the question
    resetTimer();
}

function calculateChipStack(BB) {
    // Example calculation: Assume Chip Stack is a random multiplier of the Big Blind
    const multiplier = Math.floor(Math.random() * 20) + 1; // Random number between 1 and 20
    return BB * multiplier;
}

function resetTimer() {
    document.getElementById('timer').innerText = timeLimit;
    clearInterval(timer);
    timer = setInterval(updateTimer, 1000);
}

function updateTimer() {
    let timeLeft = parseInt(document.getElementById('timer').innerText);
    timeLeft--;
    if (timeLeft <= 0) {
        clearInterval(timer);
        timeOut();
    } else {
        document.getElementById('timer').innerText = timeLeft;
    }
}

function timeOut() {
    totalTime += timeLimit;
    times.push(timeLimit); // Add full time for this question
    document.getElementById('feedback').innerText = 'Time out! Moving to the next question.';
    nextQuestion();
}

document.getElementById('submitButton').addEventListener('click', () => {
    clearInterval(timer);
    checkAnswer();
});

function checkAnswer() {
    let userAnswer = parseFloat(document.getElementById('userAnswer').value);
    let correctAnswer = parseFloat(document.getElementById('gameSection').dataset.correctAnswer);

    let timeForThisQuestion = Math.max(0, (Date.now() - questionStartTime) / 1000);
    totalTime += timeForThisQuestion;
    times.push(timeForThisQuestion); // Store time for this question

    if (userAnswer === correctAnswer) {
        correctAnswers++;
        document.getElementById('feedback').innerText = 'Correct!';
    } else {
        document.getElementById('feedback').innerText = 'Incorrect!';
    }

    nextQuestion();
}

function endTraining() {
    let averageTime = times.reduce((a, b) => a + b, 0) / times.length;
    document.getElementById('resultCorrectAnswers').innerText = `Correct Answers: ${correctAnswers}`;
    document.getElementById('resultAverageTime').innerText = `Average Time Per Question: ${averageTime.toFixed(2)} seconds`;

    document.getElementById('gameSection').style.display = 'none';
    document.getElementById('resultsSection').style.display = 'block';

    // Enable the next difficulty level if the user answered enough questions correctly
    if (selectedDifficulty === 'easy' && correctAnswers >= 10) {
        document.getElementById('medium').disabled = false;
    } else if (selectedDifficulty === 'medium' && correctAnswers >= 10) {
        document.getElementById('hard').disabled = false;
    }
}

function selectRandomBB(BB_array) {
    return BB_array[Math.floor(Math.random() * BB_array.length)];
}
