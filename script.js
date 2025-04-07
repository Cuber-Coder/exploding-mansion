const rooms = [
    "Entrance Hall", "Kitchen", "Dining Room", "Basement", "Study",
    "Bedroom", "Attic", "Library", "Garden", "Secret Room"
  ];
  
  let bombRoom = "", keyRoom = "", defuserRoom = "";
  let currentRoom = "Entrance Hall";
  let hasKey = false, hasDefuser = false, gameOver = false;
  
  const connections = {
    "Entrance Hall": ["Kitchen", "Library"],
    "Kitchen": ["Entrance Hall", "Dining Room"],
    "Dining Room": ["Kitchen", "Basement"],
    "Basement": ["Dining Room"],
    "Library": ["Entrance Hall", "Study"],
    "Study": ["Library", "Bedroom"],
    "Bedroom": ["Study", "Attic"],
    "Attic": ["Bedroom"],
    "Garden": ["Secret Room"],
    "Secret Room": ["Garden"]
  };
  
  
  const roomDescriptions = {
    "Entrance Hall": "The old chandelier sways slightly. A cold breeze brushes past you.",
    "Kitchen": "The smell of rotting vegetables hangs in the air. You hear faint tapping.",
    "Dining Room": "Cobwebs cover the long table. You hear whispers from the shadows.",
    "Basement": "The air is damp. You hear dripping water echoing from deep inside.",
    "Study": "Bookshelves line the walls. A portrait's eyes seem to follow you.",
    "Bedroom": "A dusty bed lies in the center. Something just moved under it.",
    "Attic": "It's dark. You feel like you're not alone up here.",
    "Library": "Old books rustle though no one's there. Something creaks.",
    "Garden": "Dead vines wrap the fence. A crow watches you silently.",
    "Secret Room": "It's silent. Too silent. A single candle flickers on its own."
  };
  
  const roomActions = {
    "Entrance Hall": ["Search the coat rack", "Look under the carpet"],
    "Kitchen": ["Open the drawers", "Check the fridge"],
    "Dining Room": ["Look under the table", "Check behind curtains"],
    "Basement": ["Search the shelves", "Look behind the barrels"],
    "Study": ["Check the desk", "Pull on the books"],
    "Bedroom": ["Look under the bed", "Open the wardrobe"],
    "Attic": ["Climb the beam", "Check old boxes"],
    "Library": ["Inspect book titles", "Search behind bookcases"],
    "Garden": ["Check the fountain", "Look behind the statue"],
    "Secret Room": ["Check the candle", "Feel the walls"]
  };
  
  function populateDropdowns() {
    rooms.forEach(room => {
      ["bombRoom", "keyRoom", "defuserRoom"].forEach(id => {
        let opt = document.createElement("option");
        opt.value = room;
        opt.textContent = room;
        document.getElementById(id).appendChild(opt.cloneNode(true));
      });
    });
  }
  
  function startGame() {
    bombRoom = document.getElementById("bombRoom").value;
    keyRoom = document.getElementById("keyRoom").value;
    defuserRoom = document.getElementById("defuserRoom").value;
  
    if (!bombRoom || !keyRoom) {
      alert("Please select both a bomb and key room.");
      return;
    }
  
    document.getElementById("phase1").style.display = "none";
    document.getElementById("phase2").style.display = "block";
    updateRoom();
  }
  
  function updateRoom() {
    if (gameOver) return;
  
    const desc = document.getElementById("roomDescription");
    desc.innerHTML = `<strong>${currentRoom}</strong>: ${roomDescriptions[currentRoom] || "It's eerily quiet."}`;
  
    const actions = document.getElementById("actions");
    actions.innerHTML = "";
  
    // Add all custom actions
    (roomActions[currentRoom] || []).forEach(actionText => {
      let actBtn = document.createElement("button");
      actBtn.textContent = actionText;
      actBtn.onclick = () => searchRoom(actionText);
      actions.appendChild(actBtn);
    });
  
    // Move options
    connections[currentRoom]?.forEach(nextRoom => {
      let moveBtn = document.createElement("button");
      moveBtn.textContent = `Go to ${nextRoom}`;
      moveBtn.onclick = () => {
        currentRoom = nextRoom;
        updateRoom();
      };
      actions.appendChild(moveBtn);
    });
  
    // Try escape
    if (currentRoom === "Entrance Hall" && hasKey) {
      let escapeBtn = document.createElement("button");
      escapeBtn.textContent = "Use the key and escape!";
      escapeBtn.onclick = () => endGame(true);
      actions.appendChild(escapeBtn);
    }
  }
  
  function searchRoom(actionText) {
    if (gameOver) return;
  
    const special = [bombRoom, keyRoom, defuserRoom].includes(currentRoom);
    let msg = "";
  
    if (currentRoom === bombRoom) {
      if (hasDefuser) {
        msg = "⚠️ You found the bomb and defused it!";
        hasDefuser = false;
      } else {
        endGame(false);
        return;
      }
    } else if (currentRoom === keyRoom && !hasKey) {
      hasKey = true;
      msg = "🗝️ You found the key!";
    } else if (currentRoom === defuserRoom && !hasDefuser) {
      hasDefuser = true;
      msg = "🛡️ You found a defuser!";
    } else {
      msg = `You ${actionText.toLowerCase()}, but found nothing useful.`;
    }
  
    setStatus(msg);
  }
  
  function endGame(escaped) {
    gameOver = true;
    const msg = escaped
      ? "🎉 You escaped the mansion safely! Player 2 wins!"
      : "💥 Boom! You triggered the bomb. Player 1 wins!";
    setStatus(msg);
    document.getElementById("actions").innerHTML = "";
  }
  
  function setStatus(msg) {
    document.getElementById("status").textContent = msg;
  }
  
  populateDropdowns();





