const mongoCollections = require('../config/index');
const bets = mongoCollections.bets;
const data = require('../data/bets.js');

async function subBet (gameId, aspBet, aspWin, aspCollect, amlBet, amlWin, amlCollect, hspBet, hspWin, hspCollect, hmlBet, hmlWin, hmlCollect, overBet, overWin, overCollect, underBet, underWin, underCollect) {
    let newBet = {
        gameId: gameId,
        aspBet: aspBet,
        aspWin: aspWin,
        aspCollect: aspCollect, 
        amlBet: amlBet,
        amlWin: amlWin,
        amlCollect: amlCollect,
        hspBet: hspBet,
        hspWin: hspWin,
        hspCollect: hspCollect,
        hmlBet: hmlBet,
        hmlWin: hmlWin,
        hmlCollect: hmlCollect,
        overBet: overBet,
        overWin: overWin,
        overCollect: overCollect,
        underBet: underBet,
        underWin: underWin,
        underCollect: underCollect
    }

    //make ajax call using jquery (endpoint bet)
    $.ajax({
        type: "POST",
        url: "/",
        data: newBet,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            let button = document.getElementById(submitId);
            if (button) {
                button.outerHTML = "<p>Bet successfully submitted</p>";
            }
            alert(data);
        },
        failure: function(errMsg) {
            alert(errMsg);
        }
  });
}

//add submit functionality to submit buttons
let buttons = document.getElementsByClassName('subButton');
if (buttons) {
    for (let i = 0; i < buttons.length; i++) {
        buttons[i].addEventListener('click', event => {
            let gameId = buttons[i].id.substring(7);
            let aspBetId = "aspbet-" + gameId;
            let aspWinId = "aspwin-" + gameId;
            let aspCollectId = "aspcollect-" + gameId;
            let amlBetId = "amlbet-" + gameId;
            let amlWinId = "amlwin-" + gameId;
            let amlCollectId = "amlcollect-" + gameId;
            let hspBetId = "hspbet-" + gameId;
            let hspWinId = "hspwin-" + gameId;
            let hspCollectId = "hspcollect-" + gameId;
            let hmlBetId = "hmlbet-" + gameId;
            let hmlWinId = "hmlwin-" + gameId;
            let hmlCollectId = "hmlcollect-" + gameId;
            let overBetId = "overbet-" + gameId;
            let overWinId = "overwin-" + gameId;
            let overCollectId = "overcollect-" + gameId;
            let underBetId = "underbet-" + gameId;
            let underWinId = "underwin-" + gameId;
            let underCollectId = "undercollect-" + gameId;

            let aspBet = document.getElementById(aspBetId).innerHTML;
            let aspWin = document.getElementById(aspWinId).innerHTML;
            let aspCollect = document.getElementById(aspCollectId).innerHTML;
            let amlBet = document.getElementById(amlBetId).innerHTML;
            let amlWin = document.getElementById(amlWinId).innerHTML;
            let amlCollect = document.getElementById(amlCollectId).innerHTML;
            let hspBet = document.getElementById(hspBetId).innerHTML;
            let hspWin = document.getElementById(hspWinId).innerHTML;
            let hspCollect = document.getElementById(hspCollectId);
            let hmlBet = document.getElementById(hmlBetId);
            let hmlWin = document.getElementById(hmlWinId);
            let hmlCollect = document.getElementById(hmlCollectId);
            let overBet = document.getElementById(overBetId);
            let overWin = document.getElementById(overWinId);
            let overCollect = document.getElementById(overCollectId);
            let underBet = document.getElementById(underBetId);
            let underWin = document.getElementById(underWinId);
            let underCollect = document.getElementById(underCollectId);

            await subBet(gameId, aspBet, aspWin, aspCollect, amlBet, amlWin, amlCollect, hspBet, hspWin, hspCollect, hmlBet, hmlWin, hmlCollect, overBet, overWin, overCollect, underBet, underWin, underCollect);


        });
    }
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

//ASP Win
let aspWins = document.getElementsByClassName('aspWin');
if (aspWins) {
    for (let i = 0; i < aspWins.length; i++) {
        aspWins[i].addEventListener('onChange', event => {
            let gameId = aspWins[i].id.substring(7);
            let betId = "aspbet-" + gameId;
            let collectId = "aspcollect-" + gameId;
            let bet = document.getElementById(betId);
            let collect = document.getElementById(collectId);
            if (bet && collect) {
                let win = parseInt(aspWins[i].innerHTML);
                let betNum = ceiling((win / 10) * 11);
                let collectNum = win + betNum;
                bet.innerHTML = betNum;
                collect.innerHTML = collectNum;
            }
        });
    }
}

//AML win
let amlWins = document.getElementsByClassName('amlWin');
if (amlWins) {
    for (let i = 0; i < amlWins.length; i++) {
        amlWins[i].addEventListener('onChange', event => {
            let gameId = amlWins[i].id.substring(7);
            let betId = "amlbet-" + gameId;
            let collectId = "amlcollect-" + gameId;
            let mlId = "aml-" + gameId;
            let bet = document.getElementById(betId);
            let collect = document.getElementById(collectId);
            let ml = document.getElementById(mlId);
            if (bet && collect) {
                let win = parseInt(amlWins[i].innerHTML);
                let mlNum = parseInt(ml.innerHTML) / 100;
                let betNum = 0;
                if (mlNum < 0) 
                    betNum = ceiling(win / (mlNum * -1));
                else 
                    betNum = ceiling(win * mlNum);
                let collectNum = win + betNum;
                bet.innerHTML = betNum;
                collect.innerHTML = collectNum;
            }
        });
    }
}

//HSP win
let hspWins = document.getElementsByClassName('hspWin');
if (hspWins) {
    for (let i = 0; i < hspWins.length; i++) {
        hspWins[i].addEventListener('onChange', event => {
            let gameId = hspWins[i].id.substring(7);
            let betId = "hspbet-" + gameId;
            let collectId = "hspcollect-" + gameId;
            let bet = document.getElementById(betId);
            let collect = document.getElementById(collectId);
            if (bet && collect) {
                let win = parseInt(hspWins[i].innerHTML);
                let betNum = ceiling((win / 10) * 11);
                let collectNum = win + betNum;
                bet.innerHTML = betNum;
                collect.innerHTML = collectNum;
            }
        });
    }
}

//HML win
let hmlWins = document.getElementsByClassName('hmlWin');
if (hmlWins) {
    for (let i = 0; i < hmlWins.length; i++) {
        hmlWins[i].addEventListener('onChange', event => {
            let gameId = hmlWins[i].id.substring(7);
            let betId = "hmlbet-" + gameId;
            let collectId = "hmlcollect-" + gameId;
            let mlId = "hml-" + gameId;
            let bet = document.getElementById(betId);
            let collect = document.getElementById(collectId);
            let ml = document.getElementById(mlId);
            if (bet && collect) {
                let win = parseInt(hmlWins[i].innerHTML);
                let mlNum = parseInt(ml.innerHTML) / 100;
                let betNum = 0;
                if (mlNum < 0) 
                    betNum = ceiling(win / (mlNum * -1));
                else 
                    betNum = ceiling(win * mlNum);
                let collectNum = win + betNum;
                bet.innerHTML = betNum;
                collect.innerHTML = collectNum;
            }
        });
    }
}

//over win
let overwins = document.getElementsByClassName('overWin');
if (overwins) {
    for (let i = 0; i < overwins.length; i++) {
        overwins[i].addEventListener('onChange', event => {
            let gameId = overwins[i].id.substring(8);
            let betId = "overbet-" + gameId;
            let collectId = "overcollect-" + gameId;
            let bet = document.getElementById(betId);
            let collect = document.getElementById(collectId);
            if (overbet && overCollect) {
                let win = parseInt(overwins[i].innerHTML);
                let betNum = ceiling((win / 10) * 11);
                let collectNum = win + betNum;
                bet.innerHTML = betNum;
                collect.innerHTML = collectNum;
            }
        });
    }
}

//under win
let underwins = document.getElementsByClassName('underWin');
if (underwins) {
    for (let i = 0; i < underwins.length; i++) {
        underwins[i].addEventListener('onChange', event => {
            let gameId = underwins[i].id.substring(8);
            let betId = "underbet-" + gameId;
            let collectId = "undercollect-" + gameId;
            let bet = document.getElementById(betId);
            let collect = document.getElementById(collectId);
            if (underbet && underCollect) {
                let win = parseInt(underwins[i].innerHTML);
                let betNum = ceiling((win / 10) * 11);
                let collectNum = win + betNum;
                bet.innerHTML = betNum;
                collect.innerHTML = collectNum;
            }
        });
    }
}
