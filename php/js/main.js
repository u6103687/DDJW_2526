$(document).ready(function() {
    document.getElementById('playMode1').addEventListener('click', function(){
        sessionStorage.removeItem('alias');
        sessionStorage.removeItem('load');
        sessionStorage.setItem('mode', '1');
        window.location.assign("./html/game.html");
    });
    document.getElementById('playMode2').addEventListener('click', function(){
        let alias = prompt("Introdueix el teu nom per al Rànquing:") || "Anònim";
        sessionStorage.setItem('alias', alias);
        sessionStorage.removeItem('load');
        sessionStorage.setItem('mode', '2');
        window.location.assign("./html/game.html");
    });
    document.getElementById('scoresBtn').addEventListener('click', function(){
        window.location.assign("./html/scores.html");
    });
    document.getElementById('options').addEventListener('click', function(){
        window.location.assign("./html/options.html");
    });
    document.getElementById('saves').addEventListener('click', function(){
        window.location.assign("./html/saves.html");
    });
    document.getElementById('exit').addEventListener('click', function(){
        if(confirm("Segur que vols sortir?")) {
            window.close();
        }
    });
});