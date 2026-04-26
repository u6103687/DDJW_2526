const back = `
<svg width="100" height="120" viewBox="0 0 100 120">
    <rect width="100" height="120" rx="10" fill="#2c3e50" stroke="white" stroke-width="2"/>
    <text x="50" y="75" font-family="Arial" font-size="50" fill="white" text-anchor="middle">?</text>
</svg>`;
const resources = [
    // 1. Cercle vermell
    `<svg width="100" height="120" viewBox="0 0 100 120"><rect width="100" height="120" rx="10" fill="white" stroke="#ccc" stroke-width="2"/><circle cx="50" cy="60" r="30" fill="#e74c3c"/></svg>`,
    // 2. Quadrat blau
    `<svg width="100" height="120" viewBox="0 0 100 120"><rect width="100" height="120" rx="10" fill="white" stroke="#ccc" stroke-width="2"/><rect x="25" y="35" width="50" height="50" fill="#3498db"/></svg>`,
    // 3. Triangle verd
    `<svg width="100" height="120" viewBox="0 0 100 120"><rect width="100" height="120" rx="10" fill="white" stroke="#ccc" stroke-width="2"/><polygon points="50,25 80,85 20,85" fill="#2ecc71"/></svg>`,
    // 4. Rombe groc
    `<svg width="100" height="120" viewBox="0 0 100 120"><rect width="100" height="120" rx="10" fill="white" stroke="#ccc" stroke-width="2"/><polygon points="50,20 75,60 50,100 25,60" fill="#f1c40f"/></svg>`,
    // 5. Hexàgon lila
    `<svg width="100" height="120" viewBox="0 0 100 120"><rect width="100" height="120" rx="10" fill="white" stroke="#ccc" stroke-width="2"/><polygon points="30,30 70,30 90,60 70,90 30,90 10,60" fill="#9b59b6"/></svg>`,
    // 6. El·lipse taronja
    `<svg width="100" height="120" viewBox="0 0 100 120"><rect width="100" height="120" rx="10" fill="white" stroke="#ccc" stroke-width="2"/><ellipse cx="50" cy="60" rx="40" ry="20" fill="#e67e22"/></svg>`,
    // 7. Creu cian
    `<svg width="100" height="120" viewBox="0 0 100 120"><rect width="100" height="120" rx="10" fill="white" stroke="#ccc" stroke-width="2"/><polygon points="40,20 60,20 60,45 85,45 85,65 60,65 60,90 40,90 40,65 15,65 15,45 40,45" fill="#00bcd4"/></svg>`,
    // 8. Estrella rosa
    `<svg width="100" height="120" viewBox="0 0 100 120"><rect width="100" height="120" rx="10" fill="white" stroke="#ccc" stroke-width="2"/><polygon points="50,15 61,38 85,41 68,58 72,82 50,70 28,82 32,58 15,41 39,38" fill="#e84393"/></svg>`
];

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
    difficulty: 'normal',
    isProcessing: false,
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
        if (toLoad.difficulty) this.difficulty = toLoad.difficulty;
        }
        else{ // Nova partida
        let savedOptions = localStorage.options ? JSON.parse(localStorage.options) : null;
        if (savedOptions) {
            if (savedOptions.groupSize) this.groupSize = parseInt(savedOptions.groupSize);
            if (savedOptions.difficulty) this.difficulty = savedOptions.difficulty;
            if (savedOptions.pairs) this.pairs = parseInt(savedOptions.pairs);
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
        this.items.forEach((_, indx) => {
            if (this.states[indx] === StateCard.DONE || this.states[indx] === StateCard.DISABLE) {
                this.ready++;
                this.setValue && this.setValue[indx](this.items[indx]);
            }
            else {
                setTimeout(() => {
                    this.ready++;
                    this.goBack(indx);
                }, 1000 + 100 * indx);
            }
        });
    },
    click: function(indx){
        if (this.isProcessing || this.states[indx] !== StateCard.ENABLE || this.ready < this.items.length) return;
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
                    setTimeout(() => {
                       let currentMode = sessionStorage.getItem('mode') || '1';
                       if (currentMode === '1') {
                        alert(`Has guanyat amb ${this.score} punts`);
                        window.location.assign("../");
                       }
                       else if (currentMode === '2') {
                        alert(`Nivell completat, passant al següent nivell`);
                       }
                    }, 500);
                }
            }
            else {
                let hideTime = 1000;
                if (this.difficulty === 'easy') hideTime = 1500;
                else if (this.difficulty === 'hard') hideTime = 500;
                
                this.isProcessing = true;
                let cardsToHide = [...this.selectedCards];               
                setTimeout(() => {
                    cardsToHide.forEach(idx => this.goBack(idx));
                    this.isProcessing = false;
                }, hideTime);               
                
                this.score -= 25;
                if (this.score <= 0){
                    setTimeout(() => {
                        alert ("Has perdut");
                        window.location.assign("../");
                    }, hideTime);
                }
            }
            this.selectedCards = []; 
        }
    },

    save: function(){
        let to_save = JSON.stringify({
            items: this.items,
            states: this.states,
            selectedCards: this.selectedCards,
            score: this.score,
            pairs: this.pairs,
	        groupSize: this.groupSize,
            difficulty: this.difficulty,
	    mode: sessionStorage.getItem('mode')
        });
        localStorage.setItem('save_game', to_save);
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
