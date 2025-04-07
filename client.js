
const socket = io();
let roomCode = '';
let isPlayer1 = false;
let hasKey = false;
let lives = 2;

// Create 5x10 mansion grid
const gridSize = 50;
const gridDiv = document.getElementById('mansionGrid');
for (let i = 0; i < gridSize; i++) {
  const tile = document.createElement('div');
  tile.classList.add('tile');
  tile.id = 'tile-' + i;
  tile.innerText = i;
  tile.onclick = () => handleTileClick(i);
  gridDiv.appendChild(tile);
}

function createGame() {
  roomCode = document.getElementById('roomInput').value.trim();
  if (!roomCode) return alert('Enter a room code.');
  socket.emit('create-game', roomCode);
  isPlayer1 = true;
}

function joinGame() {
  roomCode = document.getElementById('roomInput').value.trim();
  if (!roomCode) return alert('Enter a room code.');
  socket.emit('join-game', roomCode);
  isPlayer1 = false;
}

socket.on('game-created', () => {
  document.getElementById('lobby').style.display = 'none';
  document.getElementById('game').style.display = 'block';
  document.getElementById('playerRole').innerText = 'You are Player 1 — Place the Bomb';
});

socket.on('both-players-ready', () => {
  document.getElementById('lobby').style.display = 'none';
  document.getElementById('game').style.display = 'block';
  document.getElementById('playerRole').innerText = isPlayer1
    ? 'You are Player 1 — Place the Bomb'
    : 'You are Player 2 — Explore the Mansion';
});

socket.on('bomb-placed', () => {
  if (isPlayer1) {
    document.getElementById('status').innerText = 'Bomb placed. Waiting for Player 2...';
  }
});

socket.on('player2-action-result', ({ location, result, lives: updatedLives }) => {
  const tile = document.getElementById('tile-' + location);
  tile.classList.add('clicked');
  let msg = '';
  lives = updatedLives;

  switch(result) {
    case 'bomb-defused': msg = 'You found the bomb but survived!'; break;
    case 'bomb-exploded': msg = 'You hit the bomb and died!'; break;
    case 'found-defuser': msg = 'You found a defuser!'; break;
    case 'found-key': hasKey = true; msg = 'You found the KEY! Now find the EXIT.'; break;
    default: msg = 'Empty room.'; break;
  }

  document.getElementById('status').innerText = msg + ' Lives: ' + lives;
});

socket.on('game-over', ({ winner }) => {
  document.getElementById('status').innerText = 'Game Over! ' + winner + ' wins!';
});

function handleTileClick(i) {
  if (isPlayer1) {
    socket.emit('place-bomb', { roomCode, location: i });
    document.getElementById('status').innerText = 'Bomb placed at tile ' + i;
  } else {
    if (hasKey && i === 49) { // EXIT is tile 49
      socket.emit('player2-escape', roomCode);
      return;
    }
    socket.emit('player2-action', { roomCode, location: i });
  }
}
