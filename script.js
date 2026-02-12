let level = 1;
let grid_size;
const image_len = 700;
let gameState = "TOSTART";

let image;
let canvas;
let ctx;

let tile_array = [];
let shuffled_tiles_array_res = [];

let selectedTile = null;
let dragOffsetX = 0;
let dragOffsetY = 0;
let isDragging = false;
let originalIndex = null;

function getGridSize() {
  return level + 2;
}

class Tile {
  constructor(id, row, col, sx, sy, ss, grid_size) {
    this.id = id; // unique id
    this.row = row;
    this.col = col;
    this.sx = sx; // source x in the image
    this.sy = sy; // source y in the image
    this.ss = ss; // source size in the image
    this.grid_size = grid_size;
    this.currentIndex = id - 1; // where tile is currently ( after shuffle)
    this.correctIndex = id - 1; // for checking win
    this.cx = sx; // canvas cordinates
    this.cy = sy; // canvas cordinates
    this.top = row > 0 ? this.correctIndex - this.grid_size : null; // neighbour represented by current_index of adjacent tiles
    this.bottom =
      row < this.grid_size - 1 ? this.correctIndex + this.grid_size : null;
    this.left = col > 0 ? this.correctIndex - 1 : null;
    this.right = col < this.grid_size - 1 ? this.correctIndex + 1 : null;
    this.adjacentSides = [false, false, false, false];
  }

  updateCanvasCords(updatedIndex) {
    let row = Math.floor(updatedIndex / this.grid_size);
    let col = updatedIndex % this.grid_size;
    let tile_len = image_len / this.grid_size;
    this.currentIndex = updatedIndex;
    this.cx = col * tile_len;
    this.cy = row * tile_len;
  }
}

// Tile related fuctions : create, fetch Tiles, Shuffle, Swap

function getTileAt(x, y, selectedTile) {
  return [...shuffled_tiles_array_res]
    .reverse()
    .filter((tile) => tile != selectedTile)
    .find(
      (tile) =>
        x >= tile.cx &&
        x <= tile.cx + tile.ss &&
        y >= tile.cy &&
        y <= tile.cy + tile.ss,
    );
}

function createTileObjects() {
  let tile_len = image_len / grid_size;
  let no_of_tiles = grid_size ** 2;
  let id = 1;
  for (let row = 0; row < grid_size; row++) {
    for (let col = 0; col < grid_size; col++) {
      tile_array.push(
        new Tile(
          id,
          row,
          col,
          col * tile_len,
          row * tile_len,
          tile_len,
          grid_size,
        ),
      );
      id++;
    }
  }
}

function shuffle_tiles(array) {
  var temp_tiles_array = [...array]; // shallow copy
  // var temp_tiles_array = array.slice(); // way 2 to make shallow copy
  // var temp_tiles_array = array.slice(); // way 3 to make shallow copy
  // var temp_tiles_array = array; // direct reference ( call by reference type)

  var shuffled_tiles_array = [];
  var n = array.length;
  var temp_idx;
  // remove the direct reference and make a copy for origonal array

  while (n > 0) {
    temp_idx = Math.floor(Math.random() * n);
    current_tile = temp_tiles_array[temp_idx];
    current_tile.updateCanvasCords(shuffled_tiles_array.length);
    shuffled_tiles_array.push(current_tile);

    temp_tiles_array.splice(temp_idx, 1);
    n--;
  }

  return shuffled_tiles_array;
}

function swapTiles(firstTile, secondTile, shuffled_tiles_array_res) {
  let temp_params = [firstTile.currentIndex, firstTile.cx, firstTile.cy];
  let temp_element = shuffled_tiles_array_res[firstTile.currentIndex];
  shuffled_tiles_array_res[firstTile.currentIndex] =
    shuffled_tiles_array_res[secondTile.currentIndex];
  shuffled_tiles_array_res[secondTile.currentIndex] = temp_element;

  firstTile.currentIndex = secondTile.currentIndex;
  firstTile.cx = secondTile.cx;
  firstTile.cy = secondTile.cy;
  [secondTile.currentIndex, secondTile.cx, secondTile.cy] = temp_params; // destructuring
}

// image randamizer function - fetch a random image

function loadRandomImage() {
  return new Promise((resolve, reject) => {
    const PRIMARY_IMAGES = [
      `https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=${image_len}&h=${image_len}&q=100`,
      `https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=${image_len}&h=${image_len}&q=100`,
      `https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=${image_len}&h=${image_len}&q=100`,
      `https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=${image_len}&h=${image_len}&q=100`,
      `https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=${image_len}&h=${image_len}&q=100`,
      `https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=${image_len}&h=${image_len}&q=100`,
      `https://images.unsplash.com/photo-1500534314209-a26db0f5b553?auto=format&fit=crop&w=${image_len}&h=${image_len}&q=100`,
      `https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&w=${image_len}&h=${image_len}&q=100`,
      `https://images.unsplash.com/photo-1470770903676-69b98201ea1c?auto=format&fit=crop&w=${image_len}&h=${image_len}&q=100`,
      `https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&w=${image_len}&h=${image_len}&q=100`,

      `https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=${image_len}&h=${image_len}&q=100`,
      `https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&w=${image_len}&h=${image_len}&q=100`,
      `https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=${image_len}&h=${image_len}&q=100`,
      `https://images.unsplash.com/photo-1519817650390-64a93db511aa?auto=format&fit=crop&w=${image_len}&h=${image_len}&q=100`,
      `https://images.unsplash.com/photo-1526481280690-7ead32cf8bce?auto=format&fit=crop&w=${image_len}&h=${image_len}&q=100`,
      `https://images.unsplash.com/photo-1504198453319-5ce911bafcde?auto=format&fit=crop&w=${image_len}&h=${image_len}&q=100`,
      `https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&w=${image_len}&h=${image_len}&q=100`,
      `https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=${image_len}&h=${image_len}&q=100`,
      `https://images.unsplash.com/photo-1508610048659-a06b669e3321?auto=format&fit=crop&w=${image_len}&h=${image_len}&q=100`,
      `https://images.unsplash.com/photo-1476610182048-b716b8518aae?auto=format&fit=crop&w=${image_len}&h=${image_len}&q=100`,

      `https://images.unsplash.com/photo-1502085671122-2d218cd434e6?auto=format&fit=crop&w=${image_len}&h=${image_len}&q=100`,
      `https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=${image_len}&h=${image_len}&q=100`,
      `https://images.unsplash.com/photo-1465101162946-4377e57745c3?auto=format&fit=crop&w=${image_len}&h=${image_len}&q=100`,
      `https://images.unsplash.com/photo-1516912481808-3406841bd33c?auto=format&fit=crop&w=${image_len}&h=${image_len}&q=100`,
      `https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=${image_len}&h=${image_len}&q=100`,
      `https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?auto=format&fit=crop&w=${image_len}&h=${image_len}&q=100`,
      `https://images.unsplash.com/photo-1511497584788-876760111969?auto=format&fit=crop&w=${image_len}&h=${image_len}&q=100`,
      `https://images.unsplash.com/photo-1493246507139-91e8fad9978e?auto=format&fit=crop&w=${image_len}&h=${image_len}&q=100`,
      `https://images.unsplash.com/photo-1504386106331-3e4e71712b38?auto=format&fit=crop&w=${image_len}&h=${image_len}&q=100`,
    ];
    const FALLBACK_IMAGE = "https://picsum.photos/900/900";
    const img = new Image();

    img.crossOrigin = "anonymous";

    // Pick random primary image
    const randomIndex = Math.floor(Math.random() * PRIMARY_IMAGES.length);
    img.src = PRIMARY_IMAGES[randomIndex];

    img.onload = () => resolve(img);

    // Fallback handler
    img.onerror = () => {
      console.warn("Unsplash image failed. Loading fallback (Picsum).");
      img.onerror = null; // prevent infinite loop
      img.src = FALLBACK_IMAGE;
    };
  });
}

// canvas related functions to check adjacency and drawtiles

function getRowCol(index) {
  return {
    row: Math.floor(index / grid_size),
    col: index % grid_size,
  };
}

function areAdjacentNow(a, b) {
  const diff = Math.abs(a.currentIndex - b.currentIndex);
  // left right
  if (diff == 1) {
    return (
      Math.floor(a.currentIndex / grid_size) ===
      Math.floor(b.currentIndex / grid_size)
    );
  }
  // top bottom
  if (diff === grid_size) return true;
  return false;
}

function areCorrectlyAdjacent(a, b) {
  // must be original neighbors
  const diff = Math.abs(a.correctIndex - b.correctIndex);
  if (diff !== 1 && diff !== grid_size) return false;

  const A = getRowCol(a.currentIndex);
  const B = getRowCol(b.currentIndex);

  // LEFT / RIGHT
  if (a.correctIndex + 1 === b.correctIndex) {
    return A.row === B.row && A.col + 1 === B.col;
  }
  if (a.correctIndex - 1 === b.correctIndex) {
    return A.row === B.row && A.col - 1 === B.col;
  }

  // TOP / BOTTOM
  if (a.correctIndex + grid_size === b.correctIndex) {
    return A.col === B.col && A.row + 1 === B.row;
  }
  if (a.correctIndex - grid_size === b.correctIndex) {
    return A.col === B.col && A.row - 1 === B.row;
  }

  return false;
}

function verifyAdjacency() {
  shuffled_tiles_array_res.forEach((tile) => {
    // Fixed order: [top, right, bottom, left]
    const adjacentSides = [0, 0, 0, 0];

    // TOP
    if (tile.top !== null) {
      const neighbor = tile_array[tile.top];
      if (areCorrectlyAdjacent(tile, neighbor)) {
        adjacentSides[0] = true;
      }
    }

    // RIGHT
    if (tile.right !== null) {
      const neighbor = tile_array[tile.right];
      if (areCorrectlyAdjacent(tile, neighbor)) {
        adjacentSides[1] = true;
      }
    }

    // BOTTOM
    if (tile.bottom !== null) {
      const neighbor = tile_array[tile.bottom];
      if (areCorrectlyAdjacent(tile, neighbor)) {
        adjacentSides[2] = true;
      }
    }

    // LEFT
    if (tile.left !== null) {
      const neighbor = tile_array[tile.left];
      if (areCorrectlyAdjacent(tile, neighbor)) {
        adjacentSides[3] = true;
      }
    }

    tile.adjacentSides = adjacentSides;
  });
}

function redrawCanvas(shuffled_tiles_array_res) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  shuffled_tiles_array_res
    .filter((tile) => tile != selectedTile)
    .forEach((tile) => {
      ctx.drawImage(
        image,
        tile.sx, // image cordinates
        tile.sy,
        tile.ss,
        tile.ss,
        tile.cx,
        tile.cy,
        tile.ss,
        tile.ss,
      );

      let x = tile.cx;
      let y = tile.cy;
      let size = tile.ss;

      ctx.beginPath();

      if (!tile.adjacentSides[0]) {
        ctx.moveTo(x, y);
        ctx.lineTo(x + size, y);
        ctx.stroke();
      }
      if (!tile.adjacentSides[1]) {
        ctx.moveTo(x + size, y);
        ctx.lineTo(x + size, y + size);
        ctx.stroke();
      }
      if (!tile.adjacentSides[2]) {
        ctx.moveTo(x + size, y + size);
        ctx.lineTo(x, y + size);
        ctx.stroke();
      }
      if (!tile.adjacentSides[3]) {
        ctx.moveTo(x, y + size);
        ctx.lineTo(x, y);
        ctx.stroke();
      }

      // ctx.strokeRect(tile.cx, tile.cy, tile.ss, tile.ss);
    });

  if (selectedTile) {
    ctx.drawImage(
      image,
      selectedTile.sx,
      selectedTile.sy,
      selectedTile.ss,
      selectedTile.ss,
      selectedTile.cx,
      selectedTile.cy,
      selectedTile.ss,
      selectedTile.ss,
    );
    ctx.strokeRect(
      selectedTile.cx,
      selectedTile.cy,
      selectedTile.ss,
      selectedTile.ss,
    );
  }
}

function verifyWin() {
  return shuffled_tiles_array_res.every(
    (tile) => tile.currentIndex === tile.correctIndex,
  );
}

// Inital load functions

async function startLevel() {
  document.getElementById("levelTitle").textContent = `Level ${level}`;
  gameState = "PLAYING";

  grid_size = getGridSize();
  tile_array = [];
  shuffled_tiles_array_res = [];
  selectedTile = null;
  isDragging = false;
  originalIndex = null;

  image = await loadRandomImage();

  createTileObjects();
  shuffled_tiles_array_res = shuffle_tiles(tile_array);
  verifyAdjacency();

  canvas.classList.remove("blur");

  redrawCanvas(shuffled_tiles_array_res);
}

document.addEventListener("DOMContentLoaded", async () => {
  // Initial Load
  canvas = document.getElementById("myCanvas");

  canvas.width = image_len;
  canvas.height = image_len;
  ctx = canvas.getContext("2d");

  const overlay = document.getElementById("overlay");
  overlay.addEventListener("click", async () => {
    overlay.classList.add("hidden");
    await startLevel();
  });

  const winOverlay = document.getElementById("winOverlay");
  const nextBtn = document.getElementById("nextLevelBtn");
  const menuBtn = document.getElementById("mainMenuBtn");

  function showWinScreen() {
    winOverlay.classList.remove("hidden");
  }

  nextBtn.addEventListener("click", async () => {
    winOverlay.classList.add("hidden");
    canvas.classList.remove("blur");

    level++;
    await startLevel();
  });

  menuBtn.addEventListener("click", () => {
    winOverlay.classList.add("hidden");
    canvas.classList.remove("blur");
    level = 1;

    gameState = "TOSTART";
    overlay.classList.remove("hidden");
  });

  // selecting a tile

  canvas.addEventListener("mousedown", (e) => {
    if (gameState !== "PLAYING") return;
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left; // setting the cordinates based on canvas value
    const mouseY = e.clientY - rect.top;
    console.log("event listerner fired for mousedown");

    const tile = getTileAt(mouseX, mouseY);
    if (tile) {
      selectedTile = tile;
      isDragging = true;
      dragOffsetX = mouseX - tile.cx; // setting the cordinates based on tile value over canvas
      dragOffsetY = mouseY - tile.cy;
      originalIndex = tile.currentIndex; // ✅ STORE START POSITION
    }
  });
  // dragging a tile

  canvas.addEventListener("mousemove", (e) => {
    if (gameState !== "PLAYING") return;
    if (!isDragging || !selectedTile) return;
    console.log("event listerner fired for mousemove");

    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left; // setting the cordinates based on canvas value
    const mouseY = e.clientY - rect.top;

    selectedTile.cx = mouseX - dragOffsetX;
    selectedTile.cy = mouseY - dragOffsetY;

    redrawCanvas(shuffled_tiles_array_res);
  });

  //dropping a tile ( swap )

  canvas.addEventListener("mouseup", (e) => {
    if (gameState !== "PLAYING") return;
    if (!selectedTile) return;

    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const targetTile = getTileAt(mouseX, mouseY, selectedTile);
    let adjacentSides = [];

    // CASE 1: dropped on another tile → SWAP
    if (targetTile) {
      swapTiles(selectedTile, targetTile, shuffled_tiles_array_res);
      verifyAdjacency();

      selectedTile.updateCanvasCords(selectedTile.currentIndex);
      targetTile.updateCanvasCords(targetTile.currentIndex);
    }
    // CASE 2: dropped on itself → DO NOTHING (accept drop)
    else {
      selectedTile.updateCanvasCords(originalIndex);
    }

    selectedTile = null;
    isDragging = false;
    originalIndex = null;

    redrawCanvas(shuffled_tiles_array_res);

    requestAnimationFrame(() => {
      if (verifyWin()) {
        setTimeout(() => {
          gameState = "WON";

          canvas.classList.add("blur");
          showWinScreen();
        }, 300);
      }
    });
  });

  // 1. Touch Start (Like Mousedown)
  canvas.addEventListener(
    "touchstart",
    (e) => {
      if (gameState !== "PLAYING") return;
      e.preventDefault(); // Prevents scrolling while playing
      const rect = canvas.getBoundingClientRect();
      const touch = e.touches[0];
      const mouseX = touch.clientX - rect.left;
      const mouseY = touch.clientY - rect.top;

      const tile = getTileAt(mouseX, mouseY);
      if (tile) {
        selectedTile = tile;
        isDragging = true;
        dragOffsetX = mouseX - tile.cx;
        dragOffsetY = mouseY - tile.cy;
        originalIndex = tile.currentIndex;
      }
    },
    { passive: false },
  );

  // 2. Touch Move (Like Mousemove)
  canvas.addEventListener(
    "touchmove",
    (e) => {
      if (gameState !== "PLAYING" || !isDragging || !selectedTile) return;
      e.preventDefault();
      const rect = canvas.getBoundingClientRect();
      const touch = e.touches[0];
      const mouseX = touch.clientX - rect.left;
      const mouseY = touch.clientY - rect.top;

      selectedTile.cx = mouseX - dragOffsetX;
      selectedTile.cy = mouseY - dragOffsetY;
      redrawCanvas(shuffled_tiles_array_res);
    },
    { passive: false },
  );

  // 3. Touch End (Like Mouseup)
  canvas.addEventListener("touchend", (e) => {
    if (gameState !== "PLAYING" || !selectedTile) return;

    // For touchend, we use changedTouches to find where the finger left the screen
    const rect = canvas.getBoundingClientRect();
    const touch = e.changedTouches[0];
    const mouseX = touch.clientX - rect.left;
    const mouseY = touch.clientY - rect.top;

    const targetTile = getTileAt(mouseX, mouseY, selectedTile);

    if (targetTile) {
      swapTiles(selectedTile, targetTile, shuffled_tiles_array_res);
      verifyAdjacency();
      selectedTile.updateCanvasCords(selectedTile.currentIndex);
      targetTile.updateCanvasCords(targetTile.currentIndex);
    } else {
      selectedTile.updateCanvasCords(originalIndex);
    }

    selectedTile = null;
    isDragging = false;
    originalIndex = null;
    redrawCanvas(shuffled_tiles_array_res);

    if (verifyWin()) {
      setTimeout(() => {
        gameState = "WON";
        canvas.classList.add("blur");
        showWinScreen();
      }, 300);
    }
  });
});

// read up on shallow and deep copy
// optimize shuffle using FisherYates
// phase 3 currently
// add DFS for cnnection tiles
