document.getElementById('backButton').addEventListener('click', () => {
    window.location.href = 'menu.html'; // Redirect to menu.html
});


String.prototype.format = function () {
    var args = arguments;
    return this.replace(/{(\d+)}/g, function (match, number) {
        return typeof args[number] != 'undefined' ? args[number] : match;
    });
};

var cards = [];
var activeCard;

var started = false;
var enabled = false;

var startTime = new Date().getTime();
var timerEvent;
var time;
var waitEvent;

var answered = 0;
var correct = 0;
var streak = 0;
var timeAvg = 0;

function onLoad() {
    // Initialize default cards with image paths
    cards.push({
        answer: 'raise',
        image: 'image/rock.png' // Replace with actual image path
    });

    cards.push({
        answer: 'check',
        image: 'images/paper.png' // Replace with actual image path
    });

    cards.push({
        answer: 'fold',
        image: 'images/scissors.png' // Replace with actual image path
    });

    // Populate the row of buttons based on array
    populateButtons();
    populateEditDialog();
}

function reset() {
    time = 0;
    answered = 0;
    correct = 0;
    streak = 0;
    timeAvg = 0;

    document.getElementById('timer').innerHTML = 'Time: 0s';
    document.getElementById('record').innerHTML = 'Correct: 0/0 (0%)';
    document.getElementById('streak').innerHTML = 'Streak: 0';
    document.getElementById('avg-time').innerHTML = 'Average time: 0s';
    document.getElementById('flashcard-image').src = ''; // Clear image
}

window.onkeydown = function (e) {
    if (document.activeElement == document.getElementById('autofail'))
        return;

    var key = e.keyCode ? e.keyCode : e.which;
    key -= 49;

    var button = document.getElementById('buttons')
        .getElementsByTagName("LI")[key];

    if (key >= 0 && key < cards.length) {
        onClickButton(key);
        button.style.border = '1px inset #999';
    }
}

window.onkeyup = function (e) {
    var key = e.keyCode ? e.keyCode : e.which;
    key -= 49;

    var button = document.getElementById('buttons')
        .getElementsByTagName("LI")[key];

    if (key >= 0 && key < cards.length)
        button.style.border = '1px outset #999';
}

function populateButtons() {
    var TEMPLATE =
        '<li class="button" onClick="onClickButton({0})">\n' +
        '   <p class="button-number">\n' +
        '       {1}\n' +
        '   </p>\n' +
        '   <p class="button-answer">\n' +
        '       {2}\n' +
        '   </p>\n' +
        '</li>';
    var buttons = document.getElementById('buttons');
    buttons.innerHTML = '';

    for (var i = 0; i < cards.length; i++)
        buttons.innerHTML += TEMPLATE.format(i, i + 1, cards[i].answer);
}

function populateEditDialog() {
    var TEMPLATE =
        '<li class="edit-card-entry" draggable="true" ' +
        'ondragstart="onDragStart(event, {0})" ' +
        'ondragover="onDragOver(event, this)" ' +
        'ondragleave="onDragLeave(event, this)" ' +
        'ondrop="onDragDrop(event, {0})">\n' +
        '    Answer: <input value="{1}" ' +
        'onchange="updateCardAnswer({0}, this.value)"><br>\n' +
        '    Question image: <input type="file" ' +
        'onchange="updateCardImage(event, {0})"><br>\n' +
        '    <input type="button" value="Remove" ' +
        'onClick="removeCard({0})">\n' +
        '</li>';

    var entries = document.getElementById('edit-cards-container');
    entries.innerHTML = '';

    for (var i = 0; i < cards.length; i++)
        entries.innerHTML += TEMPLATE.format(
            i, cards[i].answer, cards[i].image);
}

function addCard() {
    cards.splice(cards.length, 0, {
        answer: '',
        image: ''
    });

    populateButtons();
    populateEditDialog();
}

function removeCard(id) {
    cards.splice(id, 1);
    populateButtons();
    populateEditDialog();
}

function updateCardAnswer(id, newString) {
    cards[id].answer = newString;
    populateButtons();
    populateEditDialog();
}

function updateCardImage(event, id) {
    var file = event.target.files[0];
    var reader = new FileReader();
    reader.onload = function (loadEvent) {
        cards[id].image = loadEvent.target.result;
        populateEditDialog();
    };
    reader.readAsDataURL(file);
}

function onDragStart(event, id) {
    event.dataTransfer.setData("draggedId", id);
}

function onDragOver(event, card) {
    event.preventDefault();
    card.style.borderTop = '1px solid #666';
}

function onDragLeave(event, card) {
    event.preventDefault();
    card.style.borderTop = '1px solid rgba(255, 255, 255, 0)';
}

function onDragDrop(event, id) {
    event.preventDefault();
    var removed = cards.splice(event.dataTransfer.getData("draggedId"), 1)
        .pop();
    cards.splice(id, 0, removed);
    populateButtons();
    populateEditDialog();
}

function flash() {
    var image = document.getElementById('flashcard-image');

    activeCard = Math.floor(Math.random() * cards.length);

    // Display the image of the active card
    image.src = cards[activeCard].image;

    document.getElementById('message').innerHTML = 'Press a button!';

    if (document.getElementById('sound').checked)
        new Audio('sound/flash.wav').play();

    document.body.style.background = '#fff';

    // Timer
    time = 0;
    enabled = true;
    startTime = new Date().getTime();
    timerEvent = setInterval(timerCountUp, 1);
}

function timerCountUp() {
    var TEMPLATE = 'Time: {0}s';
    var autoFail = document.getElementById('autofail');

    time = new Date().getTime() - startTime;
    document.getElementById('timer').innerHTML = TEMPLATE.format(time / 1000);

    if (autoFail.value && autoFail.value * 1000 < time) {
        clearInterval(timerEvent);
        onClickButton(-1);
    }
}

function onClickStart() {
    var startButton = document.getElementById('start');
    var message = document.getElementById('message');

    // If started, stop. If stopped, start.
    started = !started;

    // If we're (not) starting...
    if (started) {
        flash();
        startButton.value = 'Stop';
    } else {
        clearInterval(timerEvent);
        clearInterval(waitEvent);
        enabled = false;
        startButton.value = 'Start';
        message.innerHTML = 'Click "Start"!';
    }
}

function onClickButton(id) {
    // Format string templates
    var CORRECT_TEMPLATE = 'Correct: {0}/{1} ({2}%)';
    var STREAK_TEMPLATE = 'Streak: {0}';
    var TIME_AVG_TEMPLATE = 'Average time: {0}s';

    // HTML elements
    var message = document.getElementById('message');
    var recordMessage = document.getElementById('record');
    var streakMessage = document.getElementById('streak');
    var timeAvgMessage = document.getElementById('avg-time');
    var soundEnable = document.getElementById('sound');
    var backgroundEnable = document.getElementById('background');

    // Do nothing if button input disabled
    if (!enabled)
        return;

    // Stop the timer
    clearInterval(timerEvent);
    enabled = false;

    // If incorrect, display an error message and return
    if (cards[id].answer !== cards[activeCard].answer) {
        message.innerHTML = 'Incorrect!';
        streak = 0;
    } else {
        message.innerHTML = 'Correct!';
        correct++;
        streak++;

        // Update average time
        timeAvg = (timeAvg * answered + time) / (answered + 1);
        timeAvgMessage.innerHTML = TIME_AVG_TEMPLATE.format(
            (timeAvg / 1000).toFixed(2));

        if (backgroundEnable.checked)
            document.body.style.background = '#b3ffb3';
    }

    // Increment answered counter
    answered++;

    // Update streak and record
    recordMessage.innerHTML = CORRECT_TEMPLATE.format(
        correct, answered, (100 * correct / answered).toFixed(0));
    streakMessage.innerHTML = STREAK_TEMPLATE.format(streak);

    // Play sound
    if (soundEnable.checked) {
        new Audio('sound/correct.wav').play();
    }

    // Automatically flash the next card after a short delay
    waitEvent = setTimeout(flash, 1000);
}
