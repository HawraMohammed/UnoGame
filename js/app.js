import { card } from "./data.js";
const players = [{ name: "human", cards: [] }, { name: "computer", cards: [] }];
const colors = ["#FA2828", "#5190F5", "#FFFC63", "#61D45F"];
let playAreaCard = { name: "playArea" };
let turn = 0;
let winner = false;
const player1 = document.querySelector(".player1");
const player2 = document.querySelector(".player2");
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
function validateCard(card, playArea) {
    return (card.color === playArea.color || card.id === "t4" || card.id === "colorCard");

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
    player1.innerHTML = "";
    player2.innerHTML = "";
    playArea.innerHTML = "";
    players.forEach((player, index) => {
        player.cards.forEach((card) => {
            let cardElement = "";
            if (player.name === "computer") {
                cardElement = createCard("filpedCard");
            }
            else {
                cardElement = createCard(card.id, card.color);
                if (!validateCard(card, playAreaCard) && player.name === "human") {
                    cardElement.classList.add("notValid");
                }
                cardElement.dataset.id = card.id;
                cardElement.dataset.color = card.color;
                cardElement.addEventListener("click", handleCardClick);
            }
            const domPlayer = document.querySelector(`.player${index + 1}`);

            domPlayer.appendChild(cardElement);
        });
    });
    playArea.appendChild(createCard(playAreaCard.id, playAreaCard.color));
}
function init(num = 5) {
    distributeCards(1, playAreaCard);
    players.forEach((player) => {
        distributeCards(num, player);
    });
    updateBoard();
}

function handleCardClick(event) {
    const clickedCard = event.target.closest(".card").dataset;
    console.log("the card", clickedCard.color);
    const findCard = players[turn].cards.find((card) => ((card.id === parseInt(clickedCard.id) || card.id === clickedCard.id)
        && String(card.color) === String(clickedCard.color)));
    console.log("the card", findCard.color);
    play(findCard);
    updateBoard();
}
function play(card) {
    const selectedCard = card;
    const cardIndex = players[turn].cards.findIndex((c) => c.id === card.id);
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
        default: changeTurn();
    }
    playAreaCard.id = selectedCard.id;
    playAreaCard.color = selectedCard.color;
    console.log("selected:", selectedCard);
    console.log("playArea:", playAreaCard);
}
function changeTurn() {
    turn = (turn + 1) % players.length;
}
function handleNoValidCard() {
    distributeCards(1, players[turn]);
    const addedCard = players[turn].cards[players[turn].cards.length - 1];
    if (validateCard(addedCard, playAreaCard))
        play(addedCard);
    else {
        changeTurn(); dock.classList.add("notValid");
    }
    updateBoard();
}
function chooseColor() {
    const creatediaplay = document.createElement("div");
    creatediaplay.innerHTML = ` <div class="chooseColor">
            <div class="message">
                <h1>Choose a color</h1>
            </div>
        </div class="colors">
        <div class="color1"></div>
        <div class="color2"></div>
        <div class="color3"></div>
        <div class="color4"></div>
    </div>`;
    const dispaly = creatediaplay.firstElementChild;
    player1.appendChild(dispaly);
}
dock.addEventListener("click", handleNoValidCard);
init();