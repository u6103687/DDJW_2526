const back = `
<svg width="100" height="120" viewBox="0 0 100 120">
    <rect width="100" height="120" rx="10" fill="#2c3e50" stroke="white" stroke-width="2"/>
    <text x="50" y="75" font-family="Arial" font-size="50" fill="white" text-anchor="middle">?</text>
</svg>`;
const resources = [
    //Cercle vermell
    `<svg width="100" height="120" viewBox="0 0 100 120">
        <rect width="100" height="120" rx="10" fill="white" stroke="#ccc" stroke-width="2"/>
        <circle cx="50" cy="60" r="30" fill="#e74c3c"/>
    </svg>`,
    //Quadrat blau
    `<svg width="100" height="120" viewBox="0 0 100 120">
        <rect width="100" height="120" rx="10" fill="white" stroke="#ccc" stroke-width="2"/>
        <rect x="25" y="35" width="50" height="50" fill="#3498db"/>
    </svg>`,
    //Triangle verd
    `<svg width="100" height="120" viewBox="0 0 100 120">
        <rect width="100" height="120" rx="10" fill="white" stroke="#ccc" stroke-width="2"/>
        <polygon points="50,25 80,85 20,85" fill="#2ecc71"/>
    </svg>`,
    //Romba groc
    `<svg width="100" height="120" viewBox="0 0 100 120">
        <rect width="100" height="120" rx="10" fill="white" stroke="#ccc" stroke-width="2"/>
        <polygon points="50,20 75,60 50,100 25,60" fill="#f1c40f"/>
    </svg>`
];
const back = '../resources/back.png';

const StateCard = Object.freeze({
  DISABLE: 0,
  ENABLE: 1,
  DONE: 2
});

var game = {
    items: [],
    states: [],
    setValue: null,
    ready: 0,
    selectedCards: [],
    score: 200,
    pairs: 2,
    groupSize: 2,
    goBack: function(idx){
        this.setValue && this.setValue[idx](back);
        this.states[idx] = StateCard.ENABLE;
    },
    goFront: function(idx){
        this.setValue && this.setValue[idx](this.items[idx]);
        this.states[idx] = StateCard.DISABLE;
    },
    select: function(){
        if (sessionStorage.load){ // Carreguem partida
            let toLoad = JSON.parse(sessionStorage.load);
            this.items = toLoad.items;
            this.states = toLoad.states;
            this.selectedCards = toLoad.selectedCards || [];
            this.score = toLoad.score;
            this.pairs = toLoad.pairs;
	    this.groupSize = toLoad.groupSize || 2;
	    if (toLoad.mode) sessionStorage.setItem('mode', toLoad.mode);
	    sessionStorage.removeItem('load');
        }
        else{ // Nova partida
            let savedOptions = localStorage.options ? JSON.parse(localStorage.options) : null;
	    if (savedOptions && savedOptions.groupSize) {
		this.groupSize = parseInt(savedOptions.groupSize);
	    }
	    this.items = resources.slice();
            shuffe(this.items);
	    let baseItems = this.items.slice(0, this.pairs);
	    let totalItems = [];
	    for (let i = 0; i < this.groupSize; i++) {
		totalItems = totalItems.concat(baseItems);
	    }
	    this.items = totalItems;
            shuffe(this.items);
            this.states = new Array(this.items.length);
        }
    },
    start: function(){
        this.items.forEach((_,indx)=>{
            if (this.states[indx] === StateCard.DISABLE ||
                this.states[indx] === StateCard.DONE){
                this.ready++;
            }
            else{
                setTimeout(()=>{
                    this.ready++;
                    this.goBack(indx);
                }, 1000 + 100 * indx);
            }
        });
    },
    click: function(indx){
	if (this.states[indx] !== StateCard.ENABLE || this.ready < this.items.length) return;
        this.goFront(indx);
	this.selectedCards.push(indx);
	if (this.selectedCards.length === this.groupSize) {
		let allMatch = true;
		let firstCardValue = this.items[this.selectedCards[0]];
		for (let i = 1; i<this.selectedCards.length; i++){
			if (this.items[this.selectedCards[i]] !== firstCardValue) {
			   allMatch = false;
			   break;
			}
		}
		if (allMatch) {
			this.pairs--;
			this.selectedCards.forEach(idx => this.states[idx] = StateCard.DONE);
			if (this.pairs <= 0){
			   let currentMode = sessionStorage.getItem('mode') || '1';
			   if (currentMode === '1') {
				alert(`Has guanyat amb ${this.score} punts`);
				window.location.assign("../");
			   }
			   else if (currentMode === '2') {
				alert(`Nivell completat, passant al següent nivell`);
			   }
			}
		}
		else {
			let cardsToHide = [...this.selectedCards];
			setTimeout(() => {
				cardsToHide.forEach(idx => this.goBack(idx));
			}, 1000);
		}
	}
	this.selectedCards = [];
    }

    save: function(){
        let to_save = JSON.stringify({
            items: this.items,
            states: this.states,
            selectedCards: this.selectedCards,
            score: this.score,
            pairs: this.pairs,
	    groupSize: this.groupSize,
	    mode: sessionStorage.getItem('mode')
        });
        localStorage.setItem('saveGame', to_save);
        alert("Partida guardada");
        window.location.assign("../");
    }
}

function shuffe(arr){
    arr.sort(function () {return Math.random() - 0.5});
}

export var gameItems;
export function selectCards() { 
    game.select();
    gameItems = game.items;
}
export function clickCard(indx){ game.click(indx); }
export function startGame(){ game.start(); }
export function initCard(callback) { 
    if (!game.setValue) game.setValue = [];
    game.setValue.push(callback); 
}
export function saveGame(){
    game.save();
}
