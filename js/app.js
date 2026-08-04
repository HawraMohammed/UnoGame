import { card } from "./data.js";
const players = [{ name: "human", cards: [] }, { name: "computer", cards: [] }];
const colors = ["#FA2828", "#5190F5", "#FFFC63", "#61D45F"];
let playAreaCard = { name: "playArea" };
let turn = 0;
let winner = false;
let saveWinner = 0;
let animation = false;
const player1 = document.querySelector(".player1");
const playArea = document.querySelector(".playArea");
const dock = document.querySelector(".dock");

function distributeCards(num, destination) {
    for (let i = 0; i < num; i++) {
        const randCard = card[Math.floor(Math.random() * (card.length - 1))];
        let color = null;
        if (randCard.colored) {
            color = colors[Math.floor(Math.random() * colors.length)];
        }
        if (destination.name === "playArea") {
            destination.id = randCard.id;
            destination.color = color;
        }
        else destination.cards.push({ id: randCard.id, color: color });
    }
}
function validateCard(card) {
    return (card.id === playAreaCard.id || card.color === playAreaCard.color || card.id === "t4" || card.id === "colorCard");

}
function createCard(cardId, color = null) {
    const cardElement = document.createElement("div");
    cardElement.innerHTML = card.find((c) => c.id === cardId).html;
    const cardwrapper = cardElement.firstElementChild;
    if (color !== null) {
        cardwrapper.style.backgroundColor = color;
        cardwrapper.style.color = color;
        if (cardId === "t2") {
            cardwrapper.querySelector(".t2-one").style.backgroundColor = color;
            cardwrapper.querySelector(".t2-two").style.backgroundColor = color;
        }
    }
    return cardwrapper;

}
function updateBoard() {
    playArea.innerHTML = "";
    players.forEach((player, index) => {
        const domPlayer = document.querySelector(`.player${index + 1}`);
        domPlayer.innerHTML = "";
        player.cards.forEach((card, cardIndex) => {
            let cardElement = "";
            if (player.name === "computer") {
                cardElement = createCard("filpedCard");
            }
            else {
                cardElement = createCard(card.id, card.color);
                if (!validateCard(card) && player.name === "human") {
                    cardElement.classList.add("notValid");
                }
                cardElement.addEventListener("click", handleCardClick);
            }
            cardElement.dataset.id = card.id;
            cardElement.dataset.color = card.color;
            if (player.cards.length * 110 > 700) {
                const overlap = (player.cards.length * 110 - 700) / (player.cards.length - 1);
                cardElement.style.marginLeft = `-${overlap}px`;
            }

            console.log(index + 1, domPlayer.className);
            domPlayer.appendChild(cardElement);
        });
    });
    playArea.appendChild(createCard(playAreaCard.id, playAreaCard.color));
}
function init(num = 6) {

    distributeCards(1, playAreaCard);
    while (!parseInt(playAreaCard.id)) { distributeCards(1, playAreaCard); }

    players.forEach((player) => {
        distributeCards(num, player);
    });
    updateBoard();
}

function handleCardClick(event) {
    const clickedCard = event.target.closest(".card").dataset;
    const findCard = players[turn].cards.find((card) => ((card.id === parseInt(clickedCard.id) || card.id === clickedCard.id)
        && String(card.color) === String(clickedCard.color)));
    startFlow(findCard);
    if (players[turn].name !== "human") {
        player1.classList.add("notValid");
        dock.classList.add("notValid2");
        setTimer();
    }

}
function play(card) {
    const selectedCard = card;
    checkForWinner();
    console.log("player " + turn);
    const cardIndex = players[turn].cards.findIndex((c) => c.id === selectedCard.id && c.color === selectedCard.color);

    let movingCard = "";
    let movingCardToappend = "";

    if (players[turn].name === "computer") {
        movingCard = document.querySelector(`.player${turn + 1} .flipcard[data-id="${card.id}"]`);
        movingCardToappend = createCard(card.id, card.color);
    }
    else if (animation) {
        movingCard = dock;
        movingCardToappend = createCard(card.id, card.color);
        animation = false;
    }
    else {
        movingCard = document.querySelector(`.player${turn + 1} .card[data-id="${card.id}"]`);
        movingCardToappend = movingCard;
    }
    console.log("I'm supposeed to move ", movingCardToappend);
    const playRect = playArea.getBoundingClientRect();
    const startRect = movingCard.getBoundingClientRect();
    document.body.appendChild(movingCardToappend);

    movingCardToappend.style.position = "fixed";
    movingCardToappend.style.left = startRect.left + "px";
    movingCardToappend.style.top = startRect.top + "px";
    requestAnimationFrame(() => {
        movingCardToappend.style.left = playRect.left + "px";
        movingCardToappend.style.top = playRect.top + "px";
    });

    movingCardToappend.addEventListener("transitionend", () => {
        updateBoard();
        movingCardToappend.remove();
    });

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
    if (winner) return;
    const currentPlayer = players[turn];
    if (currentPlayer.name === "computer") {
        automatedPlayer();
    }
    else return;
}
function startFlow(card) {
    if (card.id === "t4" || card.id === "colorCard") {
        chooseColor((selectedColor) => {
            card.color = selectedColor;
            play(card);
        });

        return;
    }
    play(card);

}
function setTimer() {
    setTimeout(() => {
        updateBoard();

        setTimeout(() => {
            handleNextTurn();
        }, 800);

    }, 800);
}
dock.addEventListener("click", handleNoValidCard);
init();