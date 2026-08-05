import { card } from "./data.js";
let players = [{ name: "human", cards: [], seat: 1 }];
console.log("players at declaration:", players.length);
const colors = ["#FA2828", "#5190F5", "#FFFC63", "#61D45F"];
let playAreaCard = { name: "playArea" };
let turn = 0;
let winner = false;
let saveWinner = 0;
let animation = false;
let uid = 0;
const player1 = document.querySelector(".player1");
const playArea = document.querySelector(".playArea");
const dock = document.querySelector(".dock");
const playButton = document.querySelector(".play");
const cardSound = new Audio("./js/card.mp3");
cardSound.volume = 0.6;

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
    console.log("Before init:", players);
    players.forEach((player) => {
        const domPlayer = document.querySelector(`.player${player.seat}`);
        domPlayer.innerHTML = "";
        player.cards.forEach((card, cardIndex) => {
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

            if (player.cards.length * 110 > 700) {
                const overlap = (player.cards.length * 110 - 700) / (player.cards.length - 1);
                cardElement.style.marginLeft = `-${overlap}px`;
            }

            console.log(domPlayer.className);
            domPlayer.appendChild(cardElement);
        });
    });
    console.log(players);
    playArea.appendChild(createCard(playAreaCard.id, playAreaCard.color));
}
function init(num, playerNum) {
    console.log(playerNum);
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
    console.log(document.querySelector(".player2").className);
    console.log(document.querySelector(".player3").className);
    console.log(document.querySelector(".player4").className);



    distributeCards(1, playAreaCard);
    while (!parseInt(playAreaCard.id)) { distributeCards(1, playAreaCard); }

    players.forEach((player) => {
        distributeCards(num, player);
    });
    updateBoard();
    document.querySelector(".dashboard").classList.add("hidden");

}

function handleCardClick(event) {

    const clickedCard = event.target.closest(".card").dataset;

    const findCard = players[turn].cards.find((card) => (String(card.uid) === String(clickedCard.uid)));
    console.log("iam the clicked ", findCard);
    console.log("clicked uid:", clickedCard.uid);
    console.log("cards:", players[turn].cards);
    startFlow(findCard);
    if (players[turn].name !== "human") {
        player1.classList.add("notValid");
        dock.classList.add("notValid2");
    }

}

function play(card) {
    const selectedCard = card;
    checkForWinner();
    console.log("player " + turn);
    const cardIndex = players[turn].cards.findIndex((c) => c.uid === selectedCard.uid);

    addAnimation(selectedCard);

    players[turn].cards.splice(cardIndex, 1);
    console.log(players[turn].cards);
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
    console.log(players[turn].cards);
    console.log(turn);
    playAreaCard.id = selectedCard.id;
    playAreaCard.color = selectedCard.color;
    console.log("selected:", selectedCard);
    console.log("playArea:", playAreaCard);
    setTimer();

}
function changeTurn() {
    turn = (turn + 1) % players.length;
}
function handleNoValidCard() {
    cardSound.play();
    distributeCards(1, players[turn]);
    const addedCard = players[turn].cards[players[turn].cards.length - 1];
    if (validateCard(addedCard)) {
        console.log(" I'm in novalid play " + turn);
        animation = true;
        startFlow(addedCard);
    }
    else {
        console.log(" I'm in novalid add " + turn);
        console.log(players[turn].cards);
        console.log(addedCard);
        changeTurn();
        setTimer();
    }

}
function chooseColor(onColorChosen) {
    let chosenColor = "";
    if (players[turn].name === "human") {
        const colorsRow = document.querySelectorAll(".color");
        console.log(colorsRow);
        colorsRow.forEach((color, index) => {
            color.style.backgroundColor = colors[index];
            color.addEventListener("click", () => {
                chosenColor = colors[index];
                console.log("hey:", chosenColor);

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
    const findValidCard = players[turn].cards.find((card) => validateCard(card));
    if (findValidCard === undefined) handleNoValidCard();
    else { startFlow(findValidCard); }
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
        } else {
            message.textContent = "Game Over!!";
        } playButton.textContent = "Play Again";
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
        chooseColor((selectedColor) => {
            card.color = selectedColor;
            play(card);
            setTimer();
        });

        return;
    }
    play(card);
    setTimer();
}
function setTimer() {
    setTimeout(() => {
        updateBoard();
        console.log("Updating board");
        setTimeout(() => {
            handleNextTurn();
        }, 800);

    }, 800);
}
function addAnimation(card, destination = playArea) {
    let movingCard = "";
    let movingCardToappend = "";

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
    console.log(movingCard);
    console.log("I'm supposeed to move ", movingCardToappend);
    const playRect = destination.getBoundingClientRect();
    const startRect = movingCard.getBoundingClientRect();

    movingCardToappend.style.position = "fixed";
    movingCardToappend.style.left = startRect.left + "px";
    movingCardToappend.style.top = startRect.top + "px";
    document.body.appendChild(movingCardToappend);

    requestAnimationFrame(() => {
        movingCardToappend.style.left = playRect.left + "px";
        movingCardToappend.style.top = playRect.top + "px";
    });

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

}
dock.addEventListener("click", handleNoValidCard);
playButton.addEventListener("click", () => {
    const playersNum = document.querySelector(".playersnum").value;
    const cardsNum = document.querySelector(".cardsNum").value;
    setUp();
    init(cardsNum, playersNum);
});