$(document).ready(function() {
    let rankingData = localStorage.getItem('ranking');
    if (rankingData) {
        let ranking = JSON.parse(rankingData);
        let html = '<ol style="font-size: 1.2rem; margin-left: 20px;">';
        ranking.forEach(entry => {
            html += `<li><strong>${entry.name}</strong>: ${entry.score} punts (Nivell ${entry.level})</li>`;
        });
        html += '</ol>';
        $('#rankingList').html(html);
    } else {
        $('#rankingList').html('<p style="text-align:center;">Encara no hi ha puntuacions. Sigues el primer!</p>');
    }
    $('#return').on('click', function() {
        window.location.assign("../");
    });
});
