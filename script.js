// DATOS DE LAS PIEZAS (Simulados)
const museumData = {
    "marker-piece-1": {
        title: "Huaco Retrato Mochica",
        description: "Cerámica escultórica que representa con gran realismo el rostro de un dignatario Moche.",
        audioSrc: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3", // Audio de prueba
        subtitles: "Este huaco retrato representa a un gobernante Moche... observe los detalles faciales y la pintura bicolor."
    }
};

// REFERENCIAS DOM
const startScreen = document.getElementById('start-screen');
const startBtn = document.getElementById('start-btn');
const uiContainer = document.getElementById('ar-ui');
const titleEl = document.getElementById('piece-title');
const descEl = document.getElementById('piece-desc');
const audioBtn = document.getElementById('audio-btn');
const favBtn = document.getElementById('fav-btn');
const subtitlesEl = document.getElementById('subtitles');

let currentAudio = null;
let currentPieceId = null;

// 1. PANTALLA DE INICIO
startBtn.addEventListener('click', () => {
    startScreen.style.display = 'none';
    // Pedir permiso explícito para reproducir audio (política de navegadores)
    if(currentAudio) currentAudio.play().then(() => currentAudio.pause());
});

// 2. DETECCIÓN DE MARCADORES
AFRAME.registerComponent('markerhandler', {
    init: function () {
        this.el.addEventListener('markerFound', () => {
            console.log("Marcador encontrado");
            const markerId = this.el.id;
            currentPieceId = markerId;
            showPieceInfo(markerId);
            uiContainer.classList.remove('hidden');
        });

        this.el.addEventListener('markerLost', () => {
            console.log("Marcador perdido");
            uiContainer.classList.add('hidden');
            stopAudio();
        });
    }
});

// Asignar el handler al marcador en el HTML
document.getElementById('marker-piece-1').setAttribute('markerhandler', '');

// 3. MOSTRAR INFORMACIÓN
function showPieceInfo(id) {
    const data = museumData[id];
    if (!data) return;

    titleEl.innerText = data.title;
    descEl.innerText = data.description;
    
    // Verificar si es favorito
    checkFavorite(data.title);
}

// 4. AUDIO Y SUBTÍTULOS
audioBtn.addEventListener('click', () => {
    if (!currentPieceId) return;
    const data = museumData[currentPieceId];

    if (currentAudio && !currentAudio.paused) {
        stopAudio();
    } else {
        playAudio(data.audioSrc, data.subtitles);
    }
});

function playAudio(src, text) {
    currentAudio = new Audio(src);
    currentAudio.play();
    
    audioBtn.innerText = "⏹ Detener";
    audioBtn.classList.add('btn-active');
    
    subtitlesEl.innerText = text;
    subtitlesEl.classList.remove('hidden');

    currentAudio.onended = stopAudio;
}

function stopAudio() {
    if (currentAudio) {
        currentAudio.pause();
        currentAudio = null;
    }
    audioBtn.innerText = "🔊 Escuchar";
    audioBtn.classList.remove('btn-active');
    subtitlesEl.classList.add('hidden');
}

// 5. FAVORITOS (LocalStorage)
favBtn.addEventListener('click', () => {
    if (!currentPieceId) return;
    const title = museumData[currentPieceId].title;
    
    let favorites = JSON.parse(localStorage.getItem('museumFavorites')) || [];
    
    if (favorites.includes(title)) {
        // Quitar
        favorites = favorites.filter(item => item !== title);
        alert("Eliminado de favoritos");
        favBtn.classList.remove('btn-active');
    } else {
        // Agregar
        favorites.push(title);
        alert("Guardado en favoritos");
        favBtn.classList.add('btn-active');
    }
    
    localStorage.setItem('museumFavorites', JSON.stringify(favorites));
});

function checkFavorite(title) {
    const favorites = JSON.parse(localStorage.getItem('museumFavorites')) || [];
    if (favorites.includes(title)) {
        favBtn.classList.add('btn-active');
        favBtn.innerText = "⭐ Guardado";
    } else {
        favBtn.classList.remove('btn-active');
        favBtn.innerText = "⭐ Favorito";
    }
}