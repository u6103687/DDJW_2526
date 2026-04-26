const back = `<svg width="100" height="120" viewBox="0 0 100 120"><rect width="100" height="120" rx="10" fill="#2c3e50" stroke="white" stroke-width="2"/><text x="50" y="75" font-family="Arial" font-size="50" fill="white" text-anchor="middle">?</text></svg>`;
const resources = [`<svg width="100" height="120" viewBox="0 0 100 120"><rect width="100" height="120" rx="10" fill="white" stroke="#ccc" stroke-width="2"/><circle cx="50" cy="60" r="30" fill="#e74c3c"/></svg>`,`<svg width="100" height="120" viewBox="0 0 100 120"><rect width="100" height="120" rx="10" fill="white" stroke="#ccc" stroke-width="2"/><rect x="25" y="35" width="50" height="50" fill="#3498db"/></svg>`,`<svg width="100" height="120" viewBox="0 0 100 120"><rect width="100" height="120" rx="10" fill="white" stroke="#ccc" stroke-width="2"/><polygon points="50,25 80,85 20,85" fill="#2ecc71"/></svg>`,`<svg width="100" height="120" viewBox="0 0 100 120"><rect width="100" height="120" rx="10" fill="white" stroke="#ccc" stroke-width="2"/><polygon points="50,20 75,60 50,100 25,60" fill="#f1c40f"/></svg>`,`<svg width="100" height="120" viewBox="0 0 100 120"><rect width="100" height="120" rx="10" fill="white" stroke="#ccc" stroke-width="2"/><polygon points="30,30 70,30 90,60 70,90 30,90 10,60" fill="#9b59b6"/></svg>`,`<svg width="100" height="120" viewBox="0 0 100 120"><rect width="100" height="120" rx="10" fill="white" stroke="#ccc" stroke-width="2"/><ellipse cx="50" cy="60" rx="40" ry="20" fill="#e67e22"/></svg>`,`<svg width="100" height="120" viewBox="0 0 100 120"><rect width="100" height="120" rx="10" fill="white" stroke="#ccc" stroke-width="2"/><polygon points="40,20 60,20 60,45 85,45 85,65 60,65 60,90 40,90 40,65 15,65 15,45 40,45" fill="#00bcd4"/></svg>`,`<svg width="100" height="120" viewBox="0 0 100 120"><rect width="100" height="120" rx="10" fill="white" stroke="#ccc" stroke-width="2"/><polygon points="50,15 61,38 85,41 68,58 72,82 50,70 28,82 32,58 15,41 39,38" fill="#e84393"/></svg>`];
const StateCard = Object.freeze({DISABLE: 0, ENABLE: 1, DONE: 2});
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
    level: 1,
    isProcessing: false,
    turnsLeft: -1,
    goBack: function(idx){
        this.setValue && this.setValue[idx](back);
        this.states[idx] = StateCard.ENABLE;
    },
    goFront: function(idx){
        this.setValue && this.setValue[idx](this.items[idx]);
        this.states[idx] = StateCard.DISABLE;
    },
    saveScore: function() {
        if (sessionStorage.getItem('mode') !== '2') return;
        let alias = sessionStorage.getItem('alias') || 'Anònim';
        let ranking = JSON.parse(localStorage.getItem('ranking') || '[]');
        ranking.push({ name: alias, score: this.score, level: this.level });
        ranking.sort((a, b) => b.score - a.score);
        localStorage.setItem('ranking', JSON.stringify(ranking.slice(0, 10)));
    },
    endGame: function() {
        if (sessionStorage.getItem('mode') === '2') {
            this.saveScore();
            alert(`Partida finalitzada. Puntuació: ${this.score}`);
        }
        window.location.assign("../");
    },
    select: function(){
        if (sessionStorage.load){
            let toLoad = JSON.parse(sessionStorage.load);
            this.items = toLoad.items;
            this.states = toLoad.states;
            this.selectedCards = toLoad.selectedCards || [];
            this.score = toLoad.score;
            this.pairs = toLoad.pairs;
            this.groupSize = toLoad.groupSize || 2;
            this.level = toLoad.level || 1;
            this.turnsLeft = toLoad.turnsLeft || -1;
            if (toLoad.mode) sessionStorage.setItem('mode', toLoad.mode);
            sessionStorage.removeItem('load');
            if (toLoad.difficulty) this.difficulty = toLoad.difficulty;
        } else if (sessionStorage.mode2_next_level) {
            let nextLvlData = JSON.parse(sessionStorage.mode2_next_level);
            this.pairs = nextLvlData.pairs;
            this.groupSize = nextLvlData.groupSize;
            this.score = nextLvlData.score;
            this.difficulty = nextLvlData.difficulty;
            this.level = nextLvlData.level;
            let baseTime = this.difficulty === 'hard' ? 500 : (this.difficulty === 'easy' ? 1500 : 1000);
            if (baseTime - (this.level - 1) * 100 <= 200) {
                this.turnsLeft = Math.ceil(this.pairs * 1.5);
            } else {
                this.turnsLeft = -1;
            }
            sessionStorage.removeItem('mode2_next_level');
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
        } else {
            this.level = 1;
            this.turnsLeft = -1;
            if (sessionStorage.getItem('mode') === '2') {
                this.pairs = 2;
                this.groupSize = 2;
                this.difficulty = 'easy';
            } else {
                let savedOptions = localStorage.options ? JSON.parse(localStorage.options) : null;
                if (savedOptions) {
                    if (savedOptions.groupSize) this.groupSize = parseInt(savedOptions.groupSize);
                    if (savedOptions.difficulty) this.difficulty = savedOptions.difficulty;
                    if (savedOptions.pairs) this.pairs = parseInt(savedOptions.pairs);
                }
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
            } else {
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
            if (this.turnsLeft > 0) this.turnsLeft--;
            let allMatch = true;
            let firstCardValue = this.items[this.selectedCards[0]];
            for (let i = 1; i < this.selectedCards.length; i++){
                if (this.items[this.selectedCards[i]] !== firstCardValue) {
                    allMatch = false;
                    break;
                }
            }
            if (allMatch) {
                this.pairs--;
                if (sessionStorage.getItem('mode') === '2') this.score += (10 * this.level);
                this.selectedCards.forEach(idx => this.states[idx] = StateCard.DONE);
                if (this.pairs <= 0){
                    setTimeout(() => {
                        let currentMode = sessionStorage.getItem('mode') || '1';
                        if (currentMode === '1') {
                            alert(`Has guanyat amb ${this.score} punts`);
                            window.location.assign("../");
                        } else if (currentMode === '2') {
                            this.score += (100 * this.level);
                            alert(`Nivell ${this.level} completat! +${100 * this.level} punts`);
                            this.level++;
                            this.pairs = Math.min(8, (this.items.length / this.groupSize) + 1);
                            if (this.level % 2 === 0) this.groupSize++;
                            sessionStorage.setItem('mode2_next_level', JSON.stringify({
                                level: this.level,
                                pairs: this.pairs,
                                groupSize: this.groupSize,
                                score: this.score,
                                difficulty: this.difficulty
                            }));
                            window.location.reload();
                        }
                    }, 500);
                }
            } else {
                let baseTime = this.difficulty === 'easy' ? 1500 : (this.difficulty === 'hard' ? 500 : 1000);
                let hideTime = Math.max(200, baseTime - (this.level - 1) * 100);
                this.isProcessing = true;
                let cardsToHide = [...this.selectedCards];
                setTimeout(() => {
                    cardsToHide.forEach(idx => this.goBack(idx));
                    this.isProcessing = false;
                }, hideTime);
                let penalty = 25 + ((this.level - 1) * 10);
                this.score -= penalty;
                if (this.score <= 0 || (this.turnsLeft === 0 && this.pairs > 0)){
                    this.saveScore();
                    setTimeout(() => {
                        let motiu = this.score <= 0 ? "Sense punts" : "Sense intents";
                        alert(`Has perdut per (${motiu}) al Nivell ${this.level}. Punts: ${this.score}`);
                        window.location.assign("../");
                    }, hideTime);
                }
            }
            this.selectedCards = [];
        }
    },
    save: function(){
        let currentSave = {
            id: Date.now(),
            date: new Date().toLocaleString(),
            mode: sessionStorage.getItem('mode') === '2' ? 'Infinit' : 'Clàssic',
            data: {
                items: this.items,
                states: this.states,
                selectedCards: this.selectedCards,
                score: this.score,
                pairs: this.pairs,
                groupSize: this.groupSize,
                difficulty: this.difficulty,
                level: this.level,
                turnsLeft: this.turnsLeft,
                mode: sessionStorage.getItem('mode')
            }
        };
        let saves = JSON.parse(localStorage.getItem('saves') || '[]');
        saves.push(currentSave);
        localStorage.setItem('saves', JSON.stringify(saves));
        alert("Partida guardada correctament");
        window.location.assign("../");
    }
};
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
export function saveGame(){ game.save(); }
export function endGame(){ game.endGame(); }