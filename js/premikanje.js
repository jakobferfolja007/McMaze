var canvas = document.getElementById('myCanvas');
var c = canvas.getContext('2d', { willReadFrequently: true });




window.addEventListener('keydown', function(e) {
    // Seznam tipk, ki jih želimo blokirati (puščice in presledek)
    if(["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "].indexOf(e.key) > -1) {
        e.preventDefault();
    }
    keys[e.key] = true;
}, false);

window.addEventListener('keyup', function(e) {
    keys[e.key] = false;
}, false);

function canMove(nextX, nextY) {
    // 1. STROGA OMEJITEV ROBOC CANVAS-A
    // Preverimo, če bi krog (center + polmer) šel izven 0-800 ali 0-900
    if (nextX - player.size < 0 || 
        nextX + player.size > canvas.width || 
        nextY - player.size < 0 || 
        nextY + player.size > canvas.height) {
        return false; // Ustavi premik na robu
    }

    // 2. PREVERJANJE TRKOV Z LABIRINTOM (Črne črte)
    // Preverimo več točk okoli kroga, da robovi ne gredo čez črto
    const checkPoints = [
        [nextX, nextY],                         // Center
        [nextX - player.size, nextY],           // Levo
        [nextX + player.size, nextY],           // Desno
        [nextX, nextY - player.size],           // Zgoraj
        [nextX, nextY + player.size],           // Spodaj
        [nextX - player.size, nextY - player.size], // Kot levo zgoraj
        [nextX + player.size, nextY + player.size]  // Kot desno spodaj
    ];

    for (let i = 0; i < checkPoints.length; i++) {
        let p = checkPoints[i];
        let pixel = c.getImageData(p[0], p[1], 1, 1).data;
        
        // pixel[0,1,2] so R,G,B vrednosti. Črna je 0,0,0.
        // Preverimo, če je barva dovolj temna (črna stena)
        if (pixel[0] < 50 && pixel[1] < 50 && pixel[2] < 50 && pixel[3] > 0) {
            return false; // Zadeli smo steno
        }
    }

    return true; // Pot je prosta
}
// Nastavitve igralca
var player = {
    x: 386,    // Pozicija točno na sredini zgornjega vhoda
    y: 10,      // Malo nad črto, da lahko vstopi
    size: 6,   // Velikost igralca
    speed: 5   // Hitrost premikanja
};

// Spremljanje pritisnjenih tipk
var keys = {};
window.addEventListener('keydown', e => keys[e.key] = true);
window.addEventListener('keyup', e => keys[e.key] = false);



// Funkcija preveri, če je na določenih koordinatah črna barva
function canMove(nextX, nextY) {
    // Preverimo 4 točke okoli igralca, da ne "pogoltne" črte
    const pointsToCheck = [
        [nextX - player.size, nextY - player.size],
        [nextX + player.size, nextY - player.size],
        [nextX - player.size, nextY + player.size],
        [nextX + player.size, nextY + player.size]
    ];

    for (let p of pointsToCheck) {
        let imgData = c.getImageData(p[0], p[1], 1, 1).data;
        // Če je piksel črn (R, G, B so vsi nizki), prepreči premik
        if (imgData[0] < 50 && imgData[1] < 50 && imgData[2] < 50 && imgData[3] > 0) {
            return false;
        }
    }
    return true;
}

function update() {
    let nextX = player.x;
    let nextY = player.y;

    if (keys['ArrowUp']) nextY -= player.speed;
    if (keys['ArrowDown']) nextY += player.speed;
    if (keys['ArrowLeft']) nextX -= player.speed;
    if (keys['ArrowRight']) nextX += player.speed;

    // Preveri trk preden dejansko premakneš igralca
    if (canMove(nextX, nextY)) {
        player.x = nextX;
        player.y = nextY;
    }

    draw();
    requestAnimationFrame(update);
}

function draw() {
    c.clearRect(0, 0, canvas.width, canvas.height);
    
    // Nariši labirint
    SVGIcons["maze.svg"].draw(c);
    
    // Nariši igralca
    c.fillStyle = "red";
    c.beginPath();
    c.arc(player.x, player.y, player.size, 0, Math.PI * 2);
    c.fill();
}

// Zaženi
requestAnimationFrame(update);