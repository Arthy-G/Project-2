var url = 'https://api.coingecko.com/api/v3/coins/list'
var coinsList = []
var numberOfCards = 50;
var toggledCoins = []
var toggledCoinsItems = []


function startHomePage() {

    $(`div#about`).hide();
    $(`div#home`).show();
    getInfoFromApi();
}


function startAboutPage() {
    $(`div#home`).hide();
    $(`div#about`).show();

}

function cancel() {
    $(`div#alert`).hide();
    $(`div#home`).show();
    $(':checkbox').prop('checked', false);
    for (let i = 0; i < toggledCoinsItems.length; i++) {
        $(toggledCoinsItems[i]).prop('checked', true)
    }
    $(`div#savedCurrencies`).html("")
}

function getInfoFromApi() {
    $.ajax({
        type: "GET",
        url: url,
        success: function (res) {
            for (let i = 0; i < numberOfCards; i++) {
                let card = createCard(res[i])
                coinsList.push(card)
                $("#home").append(card)
            }
        },
        error: error => {
            console.log('something wrong!')
        }
    })
}

function createCard(res) {

    let container = $(`<div id='${res.symbol}' ></div>`)
    let card = $(`<div id='${res.id}' class='card'></div>`)
    let cardBody = $("<div class ='card-body' width='300px' height='300px'></div>")
    let cardTitle = $(`<h5 class = 'card-title'>${res.name}</h5>`)
    let cardSymbol = $(`<p class = 'card-text'>${res.symbol}</p>`)
    let moreInfoBtn = $(`<button id='${res.id}' onclick='coinInfo(this)' class = 'btn btn-success'>more info</button>`)
    let progressBar = $(`<div id='${res.id}-loadingmessage' style='display:none'>
        <img src='img/ajax-loader.gif'/>
        </div>`)
    $(`#${res.id}-loadingmessage`).hide(0);
    let toggleButton = $(`<label class="switch">
    <input type="checkbox" id='${res.id}' name = '${res.id}'onchange='save(this)'>
    <span class="slider round"></span>
  </label>`)
    cardBody.append(cardTitle, cardSymbol, moreInfoBtn, toggleButton, progressBar)
    card.append(cardBody)
    container.append(card)
    localStorage.setItem(`${res.id}`, JSON.stringify(res))
    return container
}

function save(item) {
    let cancelButton = $(`<button type="button" class="btn btn-danger" onclick='cancel()'>Cancel</button>`)
    let id = item.id;

    if (($(item).prop("checked"))) {

        if (toggledCoins.length < 5) {
            toggledCoins.push(id)
            toggledCoinsItems.push(item)
        } else {
            for (let i = 0; i < toggledCoins.length; i++) {
                let data = JSON.parse(localStorage.getItem(id))
                let card = createCard(data)
                $(`div#savedCurrencies`).append(card)
            }
            $(':checkbox').prop('checked', true);
            $(`div#savedCurrencies`).append(cancelButton)
            $('div#home').css('display', 'none')
            $('div#alert').css('display', 'flex')

        }
    }
    else {
        console.log("ana aref");
        for (let i = 0; i < toggledCoins.length; i++) {
            if (toggledCoins[i] == id) {
                toggledCoins.splice(i, 1)
                console.log();
                break
            }
        }
        for (let i = 0; i < toggledCoinsItems.length; i++) {
            if (toggledCoinsItems[i] == item) {
                toggledCoinsItems.splice(i, 1)
                console.log();
                break
            }
        }
    }
}


function coinInfo(coininfo) {

    $(`#${coininfo.id}-loadingmessage`).show(0);


    $.ajax({
        url: `https://api.coingecko.com/api/v3/coins/${coininfo.id}`,
        success: function (res) {

            $(`#${coininfo.id}-loadingmessage`).hide(0);
            let infoCard = createMoreInfo(res)
            $(`div#${coininfo.id}`).hide(1000)
            if ($(`#${res.id}-1`).length == 0)
                $(`div#${res.symbol}`).append(infoCard)
            else
                $(`#${res.id}-1`).show(1000);
        }
    })


}

function createMoreInfo(res) {

    let card = $(`<div id='${res.id}-1' class='card'></div>`)
    let img = $(`<img src='${res.image.small}' class='card-img-top'>`)
    let cardBody = $("<div class ='card-body'></div>")
    let info = $(`<p class ='card-text'>USD:${res.market_data.current_price.usd}$<br>EUR:${res.market_data.current_price.eur}€<br>ILS:${res.market_data.current_price.ils}₪</p>`)
    let backBtn = $(`<button id='${res.id}' class='btn btn-primary' onclick='closeMoreInfo(this)'>Close</button>`)
    cardBody.append(info, backBtn)
    card.append(img, cardBody)
    return card
}

function closeMoreInfo(close) {
    $(`div#${close.id}-1`).hide(1000);
    $(`div#${close.id}`).show(1000)
}

function searchCoin() {

    let coinId = $('#srch').val()
    for (let i = 0; i < coinsList.length; i++) {
        if (coinId === coinsList[i][0].id || coinId === '') {
            $(`div#${coinsList[i][0].id}`).show(1000);
        } else {

            $(`div#${coinsList[i][0].id}`).hide(1000);
        }
    }
}


