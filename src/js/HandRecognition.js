
// Constants
const RANKS = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
const SUITS = ['H', 'D', 'C', 'S'];
const HAND_RANKS = {
    'High Card': 1,
    'One Pair': 2,
    'Two Pair': 3,
    'Three of a Kind': 4,
    'Straight': 5,
    'Flush': 6,
    'Full House': 7,
    'Four of a Kind': 8,
    'Straight Flush': 9,
    'Royal Flush': 10
};

let questionCounter = 0;
const totalQuestions = 10;
let timerInterval;
let timeLeft = 15; // Countdown timer in seconds

// Function to shuffle and deal cards
function shuffleDeck() {
    let deck = [];
    RANKS.forEach(rank => {
        SUITS.forEach(suit => {
            deck.push(`${rank}${suit}`);
        });
    });
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    return deck;
}


// Function to generate 5-card combinations from 7 cards
function generateCombinations(cards) {
    function combinations(arr, k) {
        let result = [];
        if (k === 1) return arr.map(card => [card]);
        arr.forEach((current, index) => {
            const smallerCombinations = combinations(arr.slice(index + 1), k - 1);
            smallerCombinations.forEach(smallerCombination => {
                result.push([current, ...smallerCombination]);
            });
        });
        return result;
    }
    return combinations(cards, 5);
}

// Function to analyze a 5-card hand
function analyzeHand(hand) {
    function rankValue(rank) {
        return RANKS.indexOf(rank);
    }

    let ranks = hand.map(card => rankValue(card.slice(0, -1)));
    let suits = hand.map(card => card.slice(-1));

    ranks.sort((a, b) => a - b);

    let flush = suits.every(suit => suit === suits[0]);
    let groups = RANKS.map((_, i) => ranks.filter(rank => rank === i).length).sort((a, b) => b - a);
    let straight = (new Set(ranks)).size === 5 && (ranks[4] - ranks[0] === 4 || ranks.join('') === '01234');

    if (flush && straight) {
        return ranks.includes(12) ? 'Royal Flush' : 'Straight Flush';
    }
    if (groups[0] === 4) return 'Four of a Kind';
    if (groups[0] === 3 && groups[1] === 2) return 'Full House';
    if (flush) return 'Flush';
    if (straight) return 'Straight';
    if (groups[0] === 3) return 'Three of a Kind';
    if (groups[0] === 2 && groups[1] === 2) return 'Two Pair';
    if (groups[0] === 2) return 'One Pair';

    return 'High Card';
}

// Function to determine the best hand from 7 cards
function determineBestHand(cards) {
    const possibleHands = generateCombinations(cards);
    let bestHand = null;
    let bestRank = 0;
    let bestHandName = '';

    possibleHands.forEach(hand => {
        const handType = analyzeHand(hand);
        if (HAND_RANKS[handType] > bestRank) {
            bestRank = HAND_RANKS[handType];
            bestHand = hand;
            bestHandName = handType;
        }
    });

    return { bestHand, bestHandName };
}

// Function to display the cards
function displayCards(cards) {
    const boardCards = cards.slice(0, 5);
    const playerCards = cards.slice(5, 7);

    document.getElementById('board-cards').innerHTML = boardCards.map(card => `<img class="card" src="cards/${card}.png" alt="${card}">`).join('');
    document.getElementById('player-cards').innerHTML = playerCards.map(card => `<img class="card" src="cards/${card}.png" alt="${card}">`).join('');
}

// Function to create guess buttons
function createGuessButtons() {
    const handTypes = Object.keys(HAND_RANKS).map(hand => hand.toLowerCase().replace(/_/g, ' '));
    const guessSection = document.getElementById('guess-section');
    guessSection.innerHTML = ''; // Clear previous buttons
    handTypes.forEach(hand => {
        const button = document.createElement('button');
        button.className = 'guess-button';
        button.innerText = hand;
        button.addEventListener('click', function () {
            handleGuessClick(hand);
        });
        guessSection.appendChild(button);
    });
}

// Function to handle the user's guess
function handleGuessClick(guess) {
    const cards = Array.from(document.querySelectorAll('.card')).map(card => card.alt);
    const { bestHand, bestHandName } = determineBestHand(cards);

    const resultText = guess === bestHandName.toLowerCase() ? 'Correct!' : `Incorrect! The best hand is ${bestHandName}`;
    document.getElementById('best-hand').innerText = `Best Hand: ${bestHand.join(', ')}`;
    document.getElementById('hand-name').innerText = resultText;

    clearInterval(timerInterval); // Stop the timer when the answer is selected

    // Move to the next question after 2 seconds
    setTimeout(nextQuestion, 2000);
}

// Function to handle the next question
function nextQuestion() {
    questionCounter++;
    if (questionCounter > totalQuestions) {
        // End game
        document.getElementById('counter').innerText = `Game Over!`;
        document.getElementById('guess-section').innerHTML = '';
        return;
    }

    document.getElementById('counter').innerText = `Question ${questionCounter} of ${totalQuestions}`;
    
    // Shuffle the deck and display new cards
    const deck = shuffleDeck();
    const cards = deck.slice(0, 7);
    displayCards(cards);
    createGuessButtons(); // Recreate the buttons for the new round
    hideFeedback(); // Hide feedback from the previous question
    startTimer(); // Restart the timer for the next question
}

// Function to hide feedback after the next question is triggered
function hideFeedback() {
    document.getElementById('best-hand').innerText = '';
    document.getElementById('hand-name').innerText = '';
}

// Function to start the countdown timer
function startTimer() {
    timeLeft = 15; // Reset the time left
    document.getElementById('timer').innerText = `Time left: ${timeLeft} seconds`;

    timerInterval = setInterval(() => {
        timeLeft--;
        document.getElementById('timer').innerText = `Time left: ${timeLeft} seconds`;

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            handleGuessClick(''); // Handle no answer being selected as incorrect
        }
    }, 1000);
}

// Initial setup
function startGame() {
    questionCounter = 1;
    document.getElementById('counter').innerText = `Question ${questionCounter} of ${totalQuestions}`;
    const deck = shuffleDeck();
    const cards = deck.slice(0, 7);
    displayCards(cards);
    createGuessButtons();
    startTimer(); // Start the timer for the first question
}

// Start the game on page load
window.onload = startGame;
