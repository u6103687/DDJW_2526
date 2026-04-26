$(document).ready(function() {
    let saves = JSON.parse(localStorage.getItem('saves') || '[]');
    if (saves.length > 0) {
        let html = '<ul style="list-style: none; padding: 0;">';
        saves.forEach((save, index) => {
            html += `<li style="padding: 10px; border-bottom: 1px solid #ccc; display: flex; justify-content: space-between; align-items: center; color: #333;">
                <div>
                    <strong>#${index + 1}</strong> - ${save.date}<br>
                    <small>Mode: ${save.mode}</small>
                </div>
                <button class="loadSaveBtn" data-index="${index}" style="padding: 5px 10px; cursor: pointer;">Carregar</button>
            </li>`;
        });
        html += '</ul>';
        $('#savesList').html(html);
    } else {
        $('#savesList').html('<p style="text-align:center; color: #333;">No hi ha partides.</p>');
    }
    $('.loadSaveBtn').on('click', function() {
        let index = $(this).data('index');
        sessionStorage.setItem('load', JSON.stringify(saves[index].data));
        window.location.assign("./game.html");
    });
    $('#return').on('click', function() { window.location.assign("../"); });
});