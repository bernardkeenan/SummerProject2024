// Define the card categories
const holeCards = {
    suited: ["AKs", "AQs", "AJs", "ATs", "A9s", "A8s", "A7s", "A6s", "A5s", "A4s", "A3s", "A2s",
        "KQs", "KJs", "KTs", "K9s", "K8s", "K7s", "K6s", "K5s", "K4s", "K3s", "K2s",
        "QJs", "QTs", "Q9s", "Q8s", "Q7s", "Q6s", "Q5s", "Q4s", "Q3s", "Q2s",
        "JTs", "J9s", "J8s", "J7s", "J6s", "J5s", "J4s", "J3s", "J2s",
        "T9s", "T8s", "T7s", "T6s", "T5s", "T4s", "T3s", "T2s",
        "98s", "97s", "96s", "95s", "94s", "93s", "92s",
        "87s", "86s", "85s", "84s", "83s", "82s",
        "76s", "75s", "74s", "73s", "72s",
        "65s", "64s", "63s", "62s",
        "54s", "53s", "52s",
        "43s", "42s",
        "32s"],
    offsuit: ["AKo", "AQo", "AJo", "ATo", "A9o", "A8o", "A7o", "A6o", "A5o", "A4o", "A3o", "A2o",
        "KQo", "KJo", "KTo", "K9o", "K8o", "K7o", "K6o", "K5o", "K4o", "K3o", "K2o",
        "QJo", "QTo", "Q9o", "Q8o", "Q7o", "Q6o", "Q5o", "Q4o", "Q3o", "Q2o",
        "JTo", "J9o", "J8o", "J7o", "J6o", "J5o", "J4o", "J3o", "J2o",
        "T9o", "T8o", "T7o", "T6o", "T5o", "T4o", "T3o", "T2o",
        "98o", "97o", "96o", "95o", "94o", "93o", "92o",
        "87o", "86o", "85o", "84o", "83o", "82o",
        "76o", "75o", "74o", "73o", "72o",
        "65o", "64o", "63o", "62o",
        "54o", "53o", "52o",
        "43o", "42o",
        "32o"],
    pairs: ["AA", "KK", "QQ", "JJ", "TT", "99", "88", "77", "66", "55", "44", "33", "22"]
};

// Define answers for specific questions
const answers = {
    totalCombinations: () => {
        return holeCards.suited.length * 4 + holeCards.offsuit.length * 6 + holeCards.pairs.length * 6;
    },
    handCombinations: () => 169,
    AKoWays: () => 12,
    QQWays: () => 6,
    AKsWays: () => 4,
    handDescription: () => 'Cards in your hand',
    opponentCombinations: () => {
        const allHands = [...holeCards.suited, ...holeCards.offsuit, ...holeCards.pairs];
        const selectedHands = [];
        for (let i = 0; i < 2; i++) {
            const randomIndex = Math.floor(Math.random() * allHands.length);
            selectedHands.push(allHands[randomIndex]);
            allHands.splice(randomIndex, 1); // Remove selected hand to avoid repetition
        }

        const handCombos = {
            'AKo': 12,
            'QQ': 6,
            'AKs': 4
        };

        let totalCombinations = 0;
        selectedHands.forEach(hand => {
            totalCombinations += handCombos[hand] || 6; // Default to 6 if hand is not in the combos
        });

        return {
            question: `If I place my opponent on ${selectedHands.join(' and ')} how many combinations can they have?`,
            answer: totalCombinations
        };
    }
};

// Define difficulty levels and timers
const difficultyLevels = {
    easy: 10,
    medium: 6,
    hard: 3
};

let currentDifficulty = localStorage.getItem('selectedDifficulty') || 'easy';
let timerDuration = difficultyLevels[currentDifficulty];
let currentQuestion;
let score = 0;
let totalQuestions = 0;
let correctAnswers = 0;
let timerId;

// Start the quiz when the page loads
document.addEventListener('DOMContentLoaded', () => {
    generateQuestion();
});

// Function to generate a new question
function generateQuestion() {
    currentQuestion = getRandomQuestion();
    const questionContainer = document.getElementById('question-container');

    if (!questionContainer) {
        console.error('Question container not found');
        return;
    }

    questionContainer.innerHTML = `
        <p>${currentQuestion.question}</p>
        <input type="text" id="answer" placeholder="Your answer">
        <button onclick="checkAnswer()">Submit</button>
    `;
    startTimer();
}

// Function to get a random question
function getRandomQuestion() {
    const questionTypes = [
        { question: 'How many ways can you have {hand}?', type: 'specificHand' },
        { question: 'What is a hole card?', type: 'description' },
        { question: 'How many hole card combinations are there?', type: 'totalCombinations' },
        { question: 'How many hole card hand combinations are there?', type: 'handCombinations' },
        { question: 'If I place my opponent on {hands} how many combinations can they have?', type: 'opponentCombinations' }
    ];

    const randomQuestionType = questionTypes[Math.floor(Math.random() * questionTypes.length)];

    if (randomQuestionType.type === 'specificHand') {
        const handCategories = ['suited', 'offsuit', 'pairs'];
        const category = handCategories[Math.floor(Math.random() * handCategories.length)];
        const hand = holeCards[category][Math.floor(Math.random() * holeCards[category].length)];

        let answerFunction;
        switch (hand) {
            case 'AKo': answerFunction = answers.AKoWays; break;
            case 'QQ': answerFunction = answers.QQWays; break;
            case 'AKs': answerFunction = answers.AKsWays; break;
            default: answerFunction = () => 6; // Default or extend as needed
        }

        return {
            question: `How many ways can you have ${hand}?`,
            answer: answerFunction
        };
    } else if (randomQuestionType.type === 'opponentCombinations') {
        return answers.opponentCombinations();
    } else {
        return {
            question: randomQuestionType.question,
            answer: answers[randomQuestionType.type]
        };
    }
}

// Function to start the timer
function startTimer() {
    let timeLeft = timerDuration;
    const questionContainer = document.getElementById('question-container');

    if (!questionContainer) {
        console.error('Question container not found');
        return;
    }

    questionContainer.innerHTML += `<p id="timer">Time left: ${timeLeft}s</p>`;

    timerId = setInterval(() => {
        timeLeft--;
        document.getElementById('timer').innerText = `Time left: ${timeLeft}s`;

        if (timeLeft <= 0) {
            clearInterval(timerId);
            provideFeedback(false);
        }
    }, 1000);
}

// Function to check the user's answer
function checkAnswer() {
    clearInterval(timerId);

    const userAnswer = document.getElementById('answer').value.trim();
    const correctAnswer = currentQuestion.answer;

    if (userAnswer === correctAnswer.toString()) {
        score++;
        correctAnswers++;
        provideFeedback(true);
    } else {
        provideFeedback(false);
    }
}

// Function to provide feedback and generate new questions
function provideFeedback(isCorrect) {
    const questionContainer = document.getElementById('question-container');

    if (!questionContainer) {
        console.error('Question container not found');
        return;
    }

    questionContainer.innerHTML += `
        <p>${isCorrect ? 'Correct!' : 'Wrong!'}. The correct answer was ${currentQuestion.answer}.</p>
    `;

    totalQuestions++;
    if (totalQuestions < difficultyLevels[currentDifficulty]) {
        setTimeout(generateQuestion, 2000);
    } else {
        questionContainer.innerHTML += `<p>Quiz over! Your score is ${score}/${totalQuestions}.</p>`;
        updateDifficultyCompletion();
    }
}

// Function to update the difficulty completion status
function updateDifficultyCompletion() {
    const completedDifficulty = localStorage.getItem('completedDifficulty') || 'easy';
    const difficultyOrder = ['easy', 'medium', 'hard'];
    const currentIndex = difficultyOrder.indexOf(currentDifficulty);
    const nextDifficulty = difficultyOrder[currentIndex + 1];

    if (nextDifficulty) {
        localStorage.setItem('completedDifficulty', nextDifficulty);
    }
}
