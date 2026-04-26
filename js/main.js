addEventListener('load', function() {
    document.getElementById('playMode1').addEventListener('click', 
    function(){
	let alias = prompt("Introdueix el teu nom/àlies:") || "anònim";
        sessionStorage.setItem('alias', alias);
        sessionStorage.removeItem('load');
	sessionStorage.setItem('mode', '1');
        window.location.assign("./html/game.html");
    });

    document.getElementById('playMode2').addEventListener('click', 
    function(){
	sessionStorage.removeItem('load');
	sessionStorage.setItem('mode', '2');
	window.location.assign("./html/game.html")
    });
    document.getElementById('options').addEventListener('click', 
    function(){
        window.location.assign("./html/options.html");
    });

    document.getElementById('saves').addEventListener('click', 
    function(){
        let savedData = localStorage.getItem('save_game');
        if (!savedData) {
            alert("No hi ha cap partida a carregar");
            return;
        }
        sessionStorage.setItem ('load', savedData);
        window.location.assign("./html/game.html");
    });
    document.getElementById('scoresBtn').addEventListener('click', function(){
        window.location.assign("./html/scores.html");
    });
});

