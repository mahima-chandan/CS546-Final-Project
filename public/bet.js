const mongoCollections = require('../config/index');
const allLine = mongoCollections.lines;
const bets = mongoCollections.bets;
const lines = await this.getAllLines();

async function getAllLines() {
    const allLines = await allLine();
    const line = await allLines.find({}).toArray();
    if (line.length == 0)
        throw 'No lines to return';
    return line;
}

//ASP bet
let aspBets = document.getElementsByClassName('aspBet');
if (aspBets) {
    for (let i = 0; i < aspBets.length; i++) {
        aspBets[i].addEventListener('onChange', event => {
            let gameId = aspBets[i].id.substring(7);
            let winId = "aspwin-" + gameId;
            let collectId = "aspcollect-" + gameId;
            let win = document.getElementById(winId);
            let collect = document.getElementById(collectId);
            if (aspWin && aspCollect) {
                let bet = parseInt(aspBets[i].innerHTML);
                let winNum = floor((bet / 11) * 10);
                let collectNum = bet + winNum;
                win.innerHTML = winNum;
                collect.innerHTML = collectNum;
            }
        });
    }
}

//AML bet
let amlBets = document.getElementsByClassName('amlBet');
if (amlBets) {
    for (let i = 0; i < amlBets.length; i++) {
        amlBets[i].addEventListener('onChange', event => {
            let gameId = amlBets[i].id.substring(7);
            let winId = "amlwin-" + gameId;
            let collectId = "amlcollect-" + gameId;
            let mlId = "aml-" + gameId;
            let win = document.getElementById(winId);
            let collect = document.getElementById(collectId);
            let ml = document.getElementById(mlId);
            if (win && collect) {
                let bet = parseInt(amlBets[i].innerHTML);
                let mlNum = parseInt(ml.innerHTML) / 100;
                let winNum = 0;
                if (mlNum < 0) 
                    winNum = floor(bet / (mlNum * -1));
                else 
                    winNum = floor(bet * mlNum);
                
                let collectNum = bet + winNum;
                win.innerHTML = winNum;
                collect.innerHTML = collectNum;
            }
        });
    }
}

//HSP bet
let hspBets = document.getElementsByClassName('hspBet');
if (hspBets) {
    for (let i = 0; i < hspBets.length; i++) {
        hspBets[i].addEventListener('onChange', event => {
            let gameId = hspBets[i].id.substring(7);
            let winId = "hspwin-" + gameId;
            let collectId = "hspcollect-" + gameId;
            let win = document.getElementById(winId);
            let collect = document.getElementById(collectId);
            if (hspWin && hspCollect) {
                let bet = parseInt(hspBets[i].innerHTML);
                let winNum = floor((bet / 11) * 10);
                let collectNum = bet + winNum;
                win.innerHTML = winNum;
                collect.innerHTML = collectNum;
            }
        });
    }
}

//HML bet
let hmlBets = document.getElementsByClassName('hmlBet');
if (hmlBets) {
    for (let i = 0; i < hmlBets.length; i++) {
        hmlBets[i].addEventListener('onChange', event => {
            let gameId = hmlBets[i].id.substring(7);
            let winId = "hmlwin-" + gameId;
            let collectId = "hmlcollect-" + gameId;
            let mlId = "hml-" + gameId;
            let win = document.getElementById(winId);
            let collect = document.getElementById(collectId);
            let ml = document.getElementById(mlId);
            if (hmlWin && hmlCollect) {
                let bet = parseInt(hmlBets[i].innerHTML);
                let mlNum = parseInt(ml.innerHTML) / 100;
                let winNum = 0;
                if (mlNum < 0) 
                    winNum = floor(bet / (mlNum * -1));
                else 
                    winNum = floor(bet * mlNum);
                
                let collectNum = bet + winNum;
                win.innerHTML = winNum;
                collect.innerHTML = collectNum;
            }
        });
    }
}

//over bet
let overBets = document.getElementsByClassName('overBet');
if (overBets) {
    for (let i = 0; i < overBets.length; i++) {
        overBets[i].addEventListener('onChange', event => {
            let gameId = overBets[i].id.substring(8);
            let winId = "overwin-" + gameId;
            let collectId = "overcollect-" + gameId;
            let win = document.getElementById(winId);
            let collect = document.getElementById(collectId);
            if (overWin && overCollect) {
                let bet = parseInt(overBets[i].innerHTML);
                let winNum = floor((bet / 11) * 10);
                let collectNum = bet + winNum;
                win.innerHTML = winNum;
                collect.innerHTML = collectNum;
            }
        });
    }
}

//under bet
let underBets = document.getElementsByClassName('underBet');
if (underBets) {
    for (let i = 0; i < underBets.length; i++) {
        underBets[i].addEventListener('onChange', event => {
            let gameId = underBets[i].id.substring(9);
            let winId = "underwin-" + gameId;
            let collectId = "undercollect-" + gameId;
            let win = document.getElementById(winId);
            let collect = document.getElementById(collectId);
            if (underWin && underCollect) {
                let bet = parseInt(underBets[i].innerHTML);
                let winNum = floor((bet / 11) * 10);
                let collectNum = bet + winNum;
                win.innerHTML = winNum;
                collect.innerHTML = collectNum;
            }
        });
    }
}
