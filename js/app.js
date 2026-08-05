import { card } from "./data.js";
/*-------------------constants and variables---------------------*/
let players = [{ name: "human", cards: [], seat: 1 }];
const colors = ["#FA2828", "#5190F5", "#FFFC63", "#61D45F"];
let playAreaCard = { name: "playArea" };
let turn = 0;
let winner = false;
let saveWinner = 0;
let animation = false;
let uid = 0; // unique id for each card
const player1 = document.querySelector(".player1");
const playArea = document.querySelector(".playArea");
const dock = document.querySelector(".dock");
const playButton = document.querySelector(".play");
/*------------------------sound effects-------------------------*/
const cardSound = new Audio("./js/card.mp3");
const backgroundSound = new Audio("./js/uno_1.mp3");
const callUno = new Audio("./js/uno.mp3");
const gameOver = new Audio("./js/gameover.mp3");
const win = new Audio("./js/win.mp3");

cardSound.volume = 1;
backgroundSound.volume = 0.6;
backgroundSound.loop = true;
callUno.volume = 0.7;
gameOver.volume = 1;
win.volume = 1;
/*--------------------------Functions---------------------------*/
function distributeCards(num, destination) {
    for (let i = 0; i < num; i++) {
        const randCard = card[Math.floor(Math.random() * (card.length - 1))];
        uid++;
        let color = null;
        if (randCard.colored) {
            color = colors[Math.floor(Math.random() * colors.length)];
        }
        if (destination.name === "playArea") {
            destination.id = randCard.id;
            destination.color = color;
        }
        else destination.cards.push({ id: randCard.id, color: color, uid: uid });
    }
}
function validateCard(card) {
    return (card.id === playAreaCard.id || card.color === playAreaCard.color || card.id === "t4" || card.id === "colorCard");

}
function createCard(cardId, color = null, uid = null) {
    const cardElement = document.createElement("div");
    // find the HTML structure for the card from data.js
    cardElement.innerHTML = card.find((c) => c.id === cardId).html;
    const cardwrapper = cardElement.firstElementChild;
    if (color !== null && cardId !== "filpedCard") {
        cardwrapper.style.backgroundColor = color;
        cardwrapper.style.color = color;
        if (cardId === "t2") {
            cardwrapper.querySelector(".t2-one").style.backgroundColor = color;
            cardwrapper.querySelector(".t2-two").style.backgroundColor = color;
        }
    }
    cardwrapper.dataset.id = cardId;
    cardwrapper.dataset.color = color;
    cardwrapper.dataset.uid = uid;
    return cardwrapper;

}
function updateBoard() {
    playArea.innerHTML = "";
    players.forEach((player) => {
        const domPlayer = document.querySelector(`.player${player.seat}`);
        domPlayer.innerHTML = "";
        player.cards.forEach((card) => {
            let cardElement = "";
            if (player.name === "computer") {
                cardElement = createCard("filpedCard", card.color, card.uid);
            }
            else {
                cardElement = createCard(card.id, card.color, card.uid);
                if (!validateCard(card) && player.name === "human") {
                    cardElement.classList.add("notValid");
                }
                cardElement.addEventListener("click", handleCardClick);
            }
            // to prevent the overflow that may occur when cards number become bigger
            if (player.cards.length * 110 > 700) {
                const overlap = (player.cards.length * 110 - 700) / (player.cards.length - 1);
                cardElement.style.marginLeft = `-${overlap}px`;
            }
            domPlayer.appendChild(cardElement);
        });
    });
    playArea.appendChild(createCard(playAreaCard.id, playAreaCard.color));
}
function init(num, playerNum) {

    // so player2 sets on the third seat so they face eachother
    if (playerNum === "2") {
        document.querySelector(".player3").classList.remove("hidden");
        players.push({ name: "computer", cards: [], seat: 3 });
    }
    else {
        document.querySelector(".player2").classList.remove("hidden");
        document.querySelector(".player3").classList.remove("hidden");
        players.push({ name: "computer", cards: [], seat: 2 });
        players.push({ name: "computer", cards: [], seat: 3 });
        if (playerNum === "4") {
            document.querySelector(".player4").classList.remove("hidden");
            players.push({ name: "computer", cards: [], seat: 4 });
        }
    }

    distributeCards(1, playAreaCard);
    // keep calling distributeCard until the card is a number
    while (!parseInt(playAreaCard.id)) { distributeCards(1, playAreaCard); }

    players.forEach((player) => {
        distributeCards(num, player);
    });
    updateBoard();
    document.querySelector(".dashboard").classList.add("hidden");

}

function handleCardClick(event) {

    const clickedCard = event.target.closest(".card").dataset;
    // find the card that matches the clicked card using the unique id
    const findCard = players[turn].cards.find((card) => (String(card.uid) === String(clickedCard.uid)));
    startFlow(findCard);
    // if the next turn is a computer do not allow the human to click his cards
    if (players[turn].name !== "human") {
        player1.classList.add("notValid");
        dock.classList.add("notValid2");
    }

}

function play(card) {
    const selectedCard = card;
    checkForWinner();
    const cardIndex = players[turn].cards.findIndex((c) => c.uid === selectedCard.uid);

    addAnimation(selectedCard);

    if (players[turn].cards.length === 2) { callUno.play(); }
    // remove the selected card from the player's list
    players[turn].cards.splice(cardIndex, 1);
    switch (selectedCard.id) {
        case "t2":
            distributeCards(2, players[(turn + 1) % players.length]);
            turn = (turn + 2) % players.length;
            break;
        case "t4":
            distributeCards(4, players[(turn + 1) % players.length]);
            turn = (turn + 2) % players.length;
            break;
        case "skip":
            turn = (turn + 2) % players.length; break;
        case "reverse":
            if (players.length === 2) { turn = (turn + 2) % players.length; break; }
            else { turn = (turn - 1 + players.length) % players.length; break; }
        default: changeTurn(); break;
    }
    playAreaCard.id = selectedCard.id;
    playAreaCard.color = selectedCard.color;
    setTimer();

}
function changeTurn() {
    turn = (turn + 1) % players.length;
}
function handleNoValidCard() {
    cardSound.play();
    distributeCards(1, players[turn]);
    // select the last card that was added to the player's list (we just distributed it)
    const addedCard = players[turn].cards[players[turn].cards.length - 1];
    if (validateCard(addedCard)) {
        animation = true;
        startFlow(addedCard);
    }
    else {
        changeTurn();
        setTimer();
    }

}
function chooseColor(onColorChosen) {
    let chosenColor = "";
    if (players[turn].name === "human") {
        const colorsRow = document.querySelectorAll(".color");
        colorsRow.forEach((color, index) => {
            color.style.backgroundColor = colors[index];
            color.addEventListener("click", () => {
                chosenColor = colors[index];
                // the method will be executed only after the user clicks a button
                onColorChosen(chosenColor);
                color.closest(".chooseColor").classList.add("hidden");
            });
        });
        document.querySelector(".chooseColor").classList.remove("hidden");
    }
    else {
        chosenColor = colors[Math.floor(Math.random() * colors.length)];
        onColorChosen(chosenColor);
    }

}
function automatedPlayer() {
    // find the first card that matches the conditions of the play area card
    const findValidCard = players[turn].cards.find((card) => validateCard(card));
    if (findValidCard === undefined) handleNoValidCard();
    else { startFlow(findValidCard); }
    // allow the human player to play back
    if (players[turn].name === "human") {
        player1.classList.remove("notValid");
        dock.classList.remove("notValid2");
        setTimeout(() => {
            updateBoard();
        }, 500);
    }

}
function checkForWinner() {
    if (players[turn].cards.length === 1) {
        winner = true;
        saveWinner = turn;
    }
}
function handleNextTurn() {
    if (winner) {
        document.querySelector(".dashboard").classList.remove("hidden");
        const message = document.querySelector(".dashcontainer .message h1");

        if (saveWinner === 0) {
            message.textContent = "Congratulations!!";
            message.style.marginRight = "0px";
            message.style.fontSize = "12px";
            win.play();

        } else {
            message.textContent = "Game Over!!";
            message.style.fontSize = "20px";
            message.style.marginRight = "0px";
            gameOver.play();
        } playButton.textContent = "Play Again";
        playButton.style.fontSize = "15px";
        return;
    }

    const currentPlayer = players[turn];
    if (currentPlayer.name === "computer") {
        automatedPlayer();
        setTimer();
    }
    else return;
}
function startFlow(card) {
    cardSound.play();
    if (card.id === "t4" || card.id === "colorCard") {
        // pass the callback function to be attached to the eventlistener for each color
        chooseColor((selectedColor) => {
            card.color = selectedColor;
            play(card);
            setTimer();
        });

        return;
    }
    // this will apply to cards that already have color and do not need user input
    play(card);
    setTimer();
}
function setTimer() {
    setTimeout(() => {
        updateBoard();
        setTimeout(() => {
            handleNextTurn();
        }, 800);

    }, 800);
}
function addAnimation(card, destination = playArea) {
    let movingCard = "";
    let movingCardToappend = "";

    // select the clicked card
    if (players[turn].name === "computer" && !animation) {
        movingCard = document.querySelector(`.player${players[turn].seat} .flipcard[data-uid="${card.uid}"]`);
        movingCardToappend = createCard(card.id, card.color, card.uid);
    }
    else if (animation) {
        movingCard = dock;
        movingCardToappend = createCard(card.id, card.color, card.uid);
        animation = false;

    }
    else {
        movingCard = document.querySelector(`.player${players[turn].seat} .card[data-uid="${card.uid}"]`);
        movingCardToappend = movingCard;
    }
    // find coordinates of the clicked card and the destination
    const playRect = destination.getBoundingClientRect();
    const startRect = movingCard.getBoundingClientRect();

    // make the clone relative to the browser
    movingCardToappend.style.position = "fixed";
    // assign the position of the clone to be the same of the original card
    movingCardToappend.style.left = startRect.left + "px";
    movingCardToappend.style.top = startRect.top + "px";
    document.body.appendChild(movingCardToappend);

    // change the position of the clone to be the same of the destination
    requestAnimationFrame(() => {
        movingCardToappend.style.left = playRect.left + "px";
        movingCardToappend.style.top = playRect.top + "px";
    });
    //remove the clone
    movingCardToappend.addEventListener("transitionend", () => {
        movingCardToappend.remove();
    });
}
function setUp() {
    players = [{ name: "human", cards: [], seat: 1 }];
    playAreaCard = { name: "playArea" };
    turn = 0;
    winner = false;
    saveWinner = 0;
    animation = false;
    uid = 0;
    document.querySelector(".player2").classList.add("hidden");
    document.querySelector(".player3").classList.add("hidden");
    document.querySelector(".player4").classList.add("hidden");
    player1.classList.remove("notValid");
    dock.classList.remove("notValid2");
}
dock.addEventListener("click", handleNoValidCard);
playButton.addEventListener("click", () => {
    backgroundSound.play();
    const playersNum = document.querySelector(".playersnum").value;
    const cardsNum = document.querySelector(".cardsNum").value;
    setUp();
    init(cardsNum, playersNum);
});