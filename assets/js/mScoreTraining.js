document.getElementById('backButton').addEventListener('click', () => {
    window.location.href = 'menu.html'; // Redirect to menu.html
});


// Function to round up to the nearest multiple of a given number
function roundUpToMultiple(value, multiple) {
    return Math.ceil(value / multiple) * multiple;
}

// Array containing tuples of (Small Blind, Big Blind, Ante)
const blindsArray = [
    [25, 50, roundUpToMultiple(0.25 * 25, 25)],
    [50, 100, roundUpToMultiple(0.25 * 50, 25)],
    [75, 150, roundUpToMultiple(0.25 * 75, 25)],
    [100, 200, roundUpToMultiple(0.25 * 100, 25)],
    [150, 300, roundUpToMultiple(0.25 * 150, 25)],
    [200, 400, roundUpToMultiple(0.25 * 200, 25)],
    [300, 600, roundUpToMultiple(0.25 * 300, 25)],
    [500, 1000, roundUpToMultiple(0.25 * 500, 25)],
    [700, 1400, roundUpToMultiple(0.25 * 700, 25)],
    [1000, 2000, roundUpToMultiple(0.25 * 1000, 25)],
    [1500, 3000, roundUpToMultiple(0.25 * 1500, 25)],
    [2000, 4000, roundUpToMultiple(0.25 * 2000, 25)],
    [3000, 6000, roundUpToMultiple(0.25 * 3000, 25)],
    [5000, 10000, roundUpToMultiple(0.25 * 5000, 25)]
];

// Function to randomly select a tuple from the blinds array
function selectRandomBlind(blindsArray) {
    return blindsArray[Math.floor(Math.random() * blindsArray.length)];
}

// Function to generate a random number based on Poisson distribution
function poisson(lambda) {
    let L = Math.exp(-lambda);
    let k = 0;
    let p = 1;
    do {
        k++;
        p *= Math.random();
    } while (p > L);
    return k - 1;
}

// Variables for tracking state
let currentQuestion = 1; // Start from 1 instead of 0
const maxQuestions = 10;
let correctAnswers = 0;
let startTime;
let totalTime = 0; // Total time taken for all questions
let timer;

// Function to start a new question
function startNewQuestion() {
    if (currentQuestion > maxQuestions) {
        // Display results
        document.getElementById("feedback").textContent = `Game over! You've answered ${correctAnswers} out of ${maxQuestions} questions correctly.`;
        const averageTime = (totalTime / maxQuestions).toFixed(2);
        document.getElementById("feedback").textContent += ` Average time per question: ${averageTime} seconds.`;
        return;
    }

    // Start the timer for the question
    startTime = new Date();

    // Select random blinds
    const [SB, BB, ante] = selectRandomBlind(blindsArray);

    // Upper limit of number of big blinds
    const UL = 50;
    // Minimum chip denomination
    const Min_chip = 25;
    const limit = BB * UL / Min_chip;

    // Define the mean of the Poisson distribution
    const lambda = 0.2 * limit;

    // Generate and validate chip stack
    let randomNumber = poisson(lambda);
    while (randomNumber >= limit) {
        randomNumber = poisson(lambda);
    }

    // Generate a random number of players between 2 and 9
    const No_players = Math.floor(Math.random() * 8) + 2;

    // Calculate the M-value
    const M_value = BB + SB + (No_players * ante);
   
    let Chip_stack = randomNumber * 25;

    // Ensure Chip_stack is at least one M-value
    if (Chip_stack < M_value) {
        Chip_stack = M_value;
    }
    const M_score = Math.floor((Chip_stack + M_value - 1) / M_value);


    // Recalculate M-score with the adjusted Chip_stack
    //const M_score = Math.max(0, Math.floor((Chip_stack + M_value - 1) / M_value));

    // Display the results
    document.getElementById("sb").textContent = SB;
    document.getElementById("bb").textContent = BB;
    document.getElementById("ante").textContent = ante;
    document.getElementById("chipStack").textContent = Chip_stack;
    document.getElementById("numPlayers").textContent = No_players;
    document.getElementById("questionCounter").textContent = currentQuestion;

    // Reset feedback and timer
    document.getElementById("feedback").textContent = "";
    clearInterval(timer);
    let timeRemaining = 15; // Timer duration in seconds
    document.getElementById("timer").textContent = `Time remaining: ${timeRemaining} seconds`;

    // Start timer
    timer = setInterval(() => {
        timeRemaining--;
        document.getElementById("timer").textContent = `Time remaining: ${timeRemaining} seconds`;
        if (timeRemaining <= 0) {
            clearInterval(timer);
            const endTime = new Date();
            totalTime += (endTime - startTime) / 1000; // Convert to seconds
            document.getElementById("feedback").textContent = `Time's up! The correct M-score was ${M_score}.`;
            document.getElementById("feedback").style.color = "red";
            currentQuestion++;
            setTimeout(startNewQuestion, 2000); // Move to the next question after 2 seconds
        }
    }, 1000);

    // Handle user guess
    document.getElementById("checkGuess").onclick = function () {
        const user_guess = parseInt(document.getElementById("userGuess").value, 10);
        const feedbackElement = document.getElementById("feedback");

        const endTime = new Date();
        totalTime += (endTime - startTime) / 1000; // Convert to seconds

        if (user_guess === M_score) {
            feedbackElement.textContent = "Correct! Your guess is right.";
            feedbackElement.style.color = "green";
            correctAnswers++;
        } else {
            feedbackElement.textContent = `Wrong! The correct M-score is ${M_score}.`;
            feedbackElement.style.color = "red";
        }

        // Move to the next question
        currentQuestion++;
        setTimeout(startNewQuestion, 2000); // Move to the next question after 2 seconds
    };
}

// Start the game
document.addEventListener("DOMContentLoaded", startNewQuestion);
