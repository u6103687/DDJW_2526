import {$} from "../library/jquery-4.0.0.slim.module.min.js";
import {clickCard, gameItems, selectCards, startGame, initCard, saveGame, endGame} from "./memory.js";
var game = $('#game');
selectCards();
gameItems.forEach(function (value, idx)
{
    game.append(`<div id="${idx}" class="card" style="display:inline-block; margin:5px; cursor:pointer;"></div>`);
    let card = $(`#${idx}`);
    card.on('click', function(){
        clickCard(idx);
    });
    initCard(val => card.html(val));
});
startGame();
$('#save').on('click', ()=>saveGame());
$('#endGameBtn').on('click', function() {
    if (confirm("Segur que vols acabar la partida ara?")) {
        endGame();
    }
});