const positions = {
  UTG: 7,
  'UTG+1': 8,
  'UTG+2': 9.5,
  MP: 11,
  Lojack: 13,
  Hijack: 18,
  CO: 27,
  BTN: 48,
  SB: 36
};

const rankedHands = [
  'AA', 'KK', 'QQ', 'JJ', 'TT', '99', '88', 'AKs', 'AQs', 'AJs', 'ATs', 'KQs', 'KJs', 'QJs', 'JTs',
  'T9s', '98s', '87s', '76s', '65s', '54s', 'AKo', 'AQo', 'AJo', 'KQo', 'A9s', 'A8s', 'A7s', 'KTs',
  'QTs', 'J9s', 'T8s', '97s', '86s', '75s', 'KJo', 'QJo', 'JTo', 'T9o', '98o', '87o', '76o', '65o',
  'A6s', 'A5s', 'K9s', 'Q9s', 'J8s', 'T7s', '96s', '85s', 'KTo', 'QTo', 'J9o', 'T8o', '97o', '86o',
  '75o', '64o', 'A4s', 'A3s', 'K8s', 'Q8s', 'J7s', 'T6s', '95s', '74s', '54o', 'A2s', 'K7s', 'Q7s',
  'J6s', 'T5s', '94s', '84s', '74o', '63o', 'K6s', 'Q6s', 'J5s', 'T4s', '93s', '83s', '72o', 'K5s',
  'Q5s', 'J4s', 'T3s', '92s', '82s', 'K4s', 'Q4s', 'J3s', 'T2s', 'K3s', 'Q3s', 'J2s', 'K2s', 'Q2s'
];

const hands = [
  ['AA', 'AKo', 'AQo', 'AJo', 'ATo', 'A9o', 'A8o', 'A7o', 'A6o', 'A5o', 'A4o', 'A3o', 'A2o'],
  ['AKs', 'KK', 'KQo', 'KJo', 'KTo', 'K9o', 'K8o', 'K7o', 'K6o', 'K5o', 'K4o', 'K3o', 'K2o'],
  ['AQs', 'KQs', 'QQ', 'QJo', 'QTo', 'Q9o', 'Q8o', 'Q7o', 'Q6o', 'Q5o', 'Q4o', 'Q3o', 'Q2o'],
  ['AJs', 'KJs', 'QJs', 'JJ', 'JTo', 'J9o', 'J8o', 'J7o', 'J6o', 'J5o', 'J4o', 'J3o', 'J2o'],
  ['ATs', 'KTs', 'QTs', 'JTs', 'TT', 'T9o', 'T8o', 'T7o', 'T6o', 'T5o', 'T4o', 'T3o', 'T2o'],
  ['A9s', 'K9s', 'Q9s', 'J9s', 'T9s', '99', '98o', '97o', '96o', '95o', '94o', '93o', '92o'],
  ['A8s', 'K8s', 'Q8s', 'J8s', 'T8s', '98s', '88', '87o', '86o', '85o', '84o', '83o', '82o'],
  ['A7s', 'K7s', 'Q7s', 'J7s', 'T7s', '97s', '87s', '77', '76o', '75o', '74o', '73o', '72o'],
  ['A6s', 'K6s', 'Q6s', 'J6s', 'T6s', '96s', '86s', '76s', '66', '65o', '64o', '63o', '62o'],
  ['A5s', 'K5s', 'Q5s', 'J5s', 'T5s', '95s', '85s', '75s', '65s', '55', '54o', '53o', '52o'],
  ['A4s', 'K4s', 'Q4s', 'J4s', 'T4s', '94s', '84s', '74s', '64s', '54s', '44', '43o', '42o'],
  ['A3s', 'K3s', 'Q3s', 'J3s', 'T3s', '93s', '83s', '73s', '63s', '53s', '43s', '33', '32o'],
  ['A2s', 'K2s', 'Q2s', 'J2s', 'T2s', '92s', '82s', '72s', '62s', '52s', '42s', '32s', '22']
];

let currentRFIPosition;
let lastRFIPosition = null;
let questionCounter = 0;
const maxQuestions = 10;
const handGridElement = document.getElementById('hand-grid');
const resultElement = document.getElementById('result');
const counterElement = document.getElementById('counter');

document.getElementById('backButton').addEventListener('click', () => {
  window.location.href = 'position.html';
});

function createHandGrid() {
  handGridElement.innerHTML = '';
  hands.forEach((row, rowIndex) => {
    row.forEach((hand, colIndex) => {
      const handCell = document.createElement('div');
      handCell.className = 'hand-cell';
      handCell.innerText = hand;
      handGridElement.appendChild(handCell);
    });
  });
}

function highlightHands(rfiPercentage) {
  const handCells = document.querySelectorAll('.hand-cell');
  const handsToHighlight = Math.floor((rfiPercentage / 100) * rankedHands.length);
  const topHands = rankedHands.slice(0, handsToHighlight);

  handCells.forEach(cell => cell.classList.remove('highlight'));
  handCells.forEach(cell => {
    if (topHands.includes(cell.innerText)) {
      cell.classList.add('highlight');
    }
  });
}

function illuminateCorrectHands() {
  const handCells = document.querySelectorAll('.hand-cell');
  console.log("Total hand cells found:", handCells.length); // Debugging output

  const correctHandRange = positions[currentRFIPosition];
  const correctHands = rankedHands.slice(0, correctHandRange);
  console.log("Illuminating correct hands:", correctHands); // Debugging output

  handCells.forEach(cell => {
    if (correctHands.includes(cell.innerText)) {
      cell.classList.add('correct-highlight');
      console.log(`Highlighted: ${cell.innerText}`); // Debugging output for each highlighted cell
    }
  });
}


function setupRFIHighlighting() {
  const positionNames = Object.keys(positions);
  do {
    currentRFIPosition = positionNames[Math.floor(Math.random() * positionNames.length)];
  } while (currentRFIPosition === lastRFIPosition);
  
  lastRFIPosition = currentRFIPosition;
  const rfiRange = positions[currentRFIPosition];
  highlightHands(rfiRange);
}

function handleGuess(position) {
  resultElement.innerText = position === currentRFIPosition
    ? `Correct! The position was ${position}.`
    : `Wrong! The correct position was ${currentRFIPosition}.`;

  illuminateCorrectHands(); // Highlight the correct hand regardless of the guess outcome
  questionCounter++;
  updateCounter();

  if (questionCounter < maxQuestions) {
    setTimeout(resetForNextRound, 2000);
  } else {
    resultElement.innerText += ` Game Over! You've completed ${maxQuestions} questions.`;
  }
}

function updateCounter() {
  counterElement.innerText = `Question: ${questionCounter}/${maxQuestions}`;
}

function resetForNextRound() {
  resultElement.innerText = '';
  document.querySelectorAll('.hand-cell').forEach(cell => cell.classList.remove('correct-highlight'));
  setupRFIHighlighting();
}

document.querySelectorAll('.position-btn').forEach(button => {
  button.addEventListener('click', () => {
    handleGuess(button.getAttribute('data-position'));
  });
});

createHandGrid();
setupRFIHighlighting();
updateCounter();
