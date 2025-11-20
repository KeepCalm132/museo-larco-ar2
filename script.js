// DATOS DE LAS 3 PIEZAS
const museumData = {
    "marker-huaco": {
        title: "Huaco Retrato Moche",
        description: "Cerámica escultórica realista. Los moches eran maestros en retratar expresiones humanas y psicológicas en arcilla.",
        audioSrc: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3", 
        subtitles: "Observe los detalles del rostro. Este huaco representa a un gobernante de la élite Moche..."
    },
    "marker-oro": {
        title: "Nariguera de Oro",
        description: "Ornamento funerario de gran tamaño. El oro simbolizaba la energía solar y el poder divino de los gobernantes.",
        audioSrc: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3", 
        subtitles: "Esta nariguera cubría la boca del gobernante, dándole una apariencia sobrenatural y divina..."
    },
    "marker-felino": {
        title: "Botella Felina",
        description: "Representación de un felino (jaguar). En la cosmovisión andina, el felino representa la fuerza y el mundo terrenal (Kay Pacha).",
        audioSrc: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3", 
        subtitles: "El felino es un animal sagrado, vinculado al poder, la guerra y el gobierno..."
    }
};

// ELEMENTOS DE LA INTERFAZ
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

// 1. INICIAR EXPERIENCIA
startBtn.addEventListener('click', () => {
    startScreen.style.display = 'none';
    // Intento de reproducir y pausar para desbloquear audio en iOS/Android
    if(currentAudio) currentAudio.play().then(() => currentAudio.pause()).catch(e => {});
});

// 2. SISTEMA DE DETECCIÓN (Funciona para los 3 marcadores)
AFRAME.registerComponent('markerhandler', {
    init: function () {
        // Cuando encuentra el marcador
        this.el.addEventListener('markerFound', () => {
            const markerId = this.el.id;
            currentPieceId = markerId;
            uiContainer.classList.remove('hidden');
            updateUI(markerId);
        });

        // Cuando pierde el marcador
        this.el.addEventListener('markerLost', () => {
            uiContainer.classList.add('hidden');
            stopAudio();
        });
    }
});

// Asignar la lógica a los 3 marcadores del HTML
document.getElementById('marker-huaco').setAttribute('markerhandler', '');
document.getElementById('marker-oro').setAttribute('markerhandler', '');
document.getElementById('marker-felino').setAttribute('markerhandler', '');

// 3. ACTUALIZAR TEXTOS
function updateUI(id) {
    const data = museumData[id];
    if (!data) return;

    titleEl.innerText = data.title;
    descEl.innerText = data.description;
    checkFavorite(data.title);
}

// 4. CONTROL DE AUDIO
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
    if(currentAudio) stopAudio(); // Asegurar que no suenen dos a la vez
    
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
    audioBtn.innerText = "🔊 Escuchar Guía";
    audioBtn.classList.remove('btn-active');
    subtitlesEl.classList.add('hidden');
}

// 5. FAVORITOS (LocalStorage)
favBtn.addEventListener('click', () => {
    if (!currentPieceId) return;
    const title = museumData[currentPieceId].title;
    
    let favorites = JSON.parse(localStorage.getItem('museumFavorites')) || [];
    
    if (favorites.includes(title)) {
        favorites = favorites.filter(item => item !== title);
        alert("Eliminado de favoritos");
    } else {
        favorites.push(title);
        alert("Guardado en favoritos");
    }
    
    localStorage.setItem('museumFavorites', JSON.stringify(favorites));
    checkFavorite(title);
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