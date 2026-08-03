export const card = [{
    id: 0,
    html: `<div class="card" id="n0">
            <span class="symbol1">0</span>
            <div class="oval">
                <h1>0</h1>
            </div>
            <span class="symbol2">0</span>
        </div>`,
    colored: true
},
{
    id: 1,
    html: `<div class="card" id="1">
            <span class="symbol1">1</span>
            <div class="oval">
                <h1>1</h1>
            </div>
            <span class="symbol2">1</span>
        </div>`,
    colored: true
},
{
    id: 2,
    html: `<div class="card" id="2">
            <span class="symbol1">2</span>
            <div class="oval">
                <h1>2</h1>
            </div>
            <span class="symbol2">2</span>
        </div>`,
    colored: true
}, {
    id: 3,
    html: `   <div class="card" id="3">
            <span class="symbol1">3</span>
            <div class="oval">
                <h1>3</h1>
            </div>
            <span class="symbol2">3</span>
        </div>`,
    colored: true
},
{
    id: 4,
    html: `   <div class="card" id="4">
            <span class="symbol1">4</span>
            <div class="oval">
                <h1>4</h1>
            </div>
            <span class="symbol2">4</span>
        </div>`,
    colored: true
},
{
    id: 5,
    html: `   <div class="card" id="5">
            <span class="symbol1">5</span>
            <div class="oval">
                <h1>5</h1>
            </div>
            <span class="symbol2">5</span>
        </div>`,
    colored: true
},
{
    id: 6,
    html: `   <div class="card n6" id="6">
            <span class="symbol1">6</span>
            <div class="oval">
                <h1>6</h1>
            </div>
            <span class="symbol2">6</span>
        </div>`,
    colored: true
},
{
    id: 7,
    html: `   <div class="card" id="7">
            <span class="symbol1">7</span>
            <div class="oval">
                <h1>7</h1>
            </div>
            <span class="symbol2">7</span>
        </div>`,
    colored: true
},
{
    id: 8,
    html: `   <div class="card" id="8">
            <span class="symbol1">8</span>
            <div class="oval">
                <h1>8</h1>
            </div>
            <span class="symbol2">8</span>
        </div>`,
    colored: true
},
{
    id: 9,
    html: `   <div class="card n9" id="9">
            <span class="symbol1">9</span>
            <div class="oval">
                <h1>9</h1>
            </div>
            <span class="symbol2">9</span>
        </div>`,
    colored: true
},
{
    id: "reverse",
    html: `<div class="card" id="reverse">
            <span class="symbol1">
                ⇆
            </span>
            <div class="oval">
                <h1 class="arrow1">➥</h1>
                <h1 class="arrow2">➥</h1>
            </div>
            <span class="symbol2">
                ⇆
            </span>
        </div>`,
    colored: true
}
    , {
    id: "t2",
    html: `<div class="card" id="t2">
            <span class="symbol1">+2</span>
            <div class="oval">
                <div class="t2container">
                    <div class="t2-one"></div>
                    <div class="t2-two"></div>
                </div>
            </div>
            <span class="symbol2">+2</span>
        </div>`,
    colored: true
}
    , {
    id: "t4",
    html: ` <div class="card" id="t4">
            <span class="symbol1">+4</span>
            <div class="oval">
                <div class="t4container">
                    <div class="c1"></div>
                    <div class="c2"></div>
                    <div class="c3"></div>
                    <div class="c4"></div>
                </div>
            </div>
            <span class="symbol2">+4</span>
        </div>`,
    colored: false
}
    , {
    id: "skip",
    html: ` <div class="card" id="skip">
            <span class="symbol1"> <i class="fa-solid fa-ban"></i>
            </span>
            <div class="oval">
                <i class="fa-solid fa-ban"></i>
            </div>
            <span class="symbol2"> <i class="fa-solid fa-ban"></i>
            </span>
        </div>`,
    colored: true
},
{
    id: "colorCard",
    html: ` <div class="card" id="colorcard">
            <span class="symbol1"></span>
            <div class="oval" id="coloroval">
            </div>
            <span class="symbol2"></span>
        </div>`,
    colored: false
},
{
    id: "filpedCard",
    html: `     <div class="flipcard"">
                <div class="ovalflip">
                    <h1>UNO</h1>
                </div>
            </div>
        </div>`,
    colored: false
}
];
export const colorPanel = `<div class="chooseColor">
            <div class="message">
                <h1>Choose a color</h1>
            </div>
        <div class="colors">
        <div class="color"></div>
        <div class="color"></div>
        <div class="color"></div>
        <div class="color"></div></div>
    </div>`;