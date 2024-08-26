// Constants
const RANKS = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
const SUITS = ['?', '?', '?', '?'];
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

// Function to display the cards
function displayCards(cards) {
    const boardCards = cards.slice(0, 5);
    const playerCards = cards.slice(5, 7);

    document.getElementById('board-cards').innerHTML = boardCards.map(card => `<div class="card">${card}</div>`).join('');
    document.getElementById('player-cards').innerHTML = playerCards.map(card => `<div class="card">${card}</div>`).join('');
}

// Event listener for the "Submit Guess" button
document.getElementById('submit-guess').addEventListener('click', function () {
    const cards = Array.from(document.querySelectorAll('.card')).map(card => card.innerText);
    const { bestHand, bestHandName } = determineBestHand(cards);

    const userGuess = document.getElementById('guess').value;
    const resultText = userGuess === bestHandName ? 'Correct!' : `Incorrect! The best hand is ${bestHandName}`;

    document.getElementById('best-hand').innerText = `Best Hand: ${bestHand.join(', ')}`;
    document.getElementById('hand-name').innerText = resultText;
});

// Initial setup
const deck = shuffleDeck();
const cards = deck.slice(0, 7);
displayCards(cards);
