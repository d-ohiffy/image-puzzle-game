
# 🧩 Image Puzzle Game

A dynamic, interactive puzzle game built with **Vanilla JavaScript** and **HTML5 Canvas**. The game slices high-resolution images into interactive tiles, requiring players to rearrange them into the correct order to progress through increasingly difficult levels.

**[Live Demo Link]** | **[GitHub Repository]**

---

### 🚀 Key Features

* **Dynamic Image Slicing:** Uses HTML5 Canvas to programmatically divide a single image into a grid of tiles based on the current level.
* **Procedural Difficulty:** Each level increments the grid size (Level 1 = , Level 2 = ), increasing the complexity of the puzzle.
* **Real-time Adjacency Verification:** A custom logic engine checks if tiles are correctly placed next to their original neighbours, visually updating tile borders to guide the player.
* **Drag-and-Drop Interface:** Smooth mouse interactions for selecting, dragging, and swapping tiles within the game board.

---

### 🛠️ Technical Breakdown

#### **1. HTML5 Canvas & Image Processing**

The game utilises the `canvas.drawImage()` method to "crop" specific coordinates from a source image and render them onto the game board. This allows for a single image to be treated as multiple independent objects.

#### **2. Randomization & Shuffling**

* **Image API:** Images are fetched dynamically from **Unsplash** using a randomised index to ensure a fresh experience every time a level starts.
* **Fisher-Yates (Logic):** The `shuffle_tiles` function uses an array-shuffling algorithm to ensure the initial board state is truly random while maintaining a shallow copy of the original tile data to prevent reference errors.

#### **3. Adjacency & Win Logic**

The game maintains a `Tile` class that stores both `currentIndex` and `correctIndex`.

* **Adjacency Check:** On every move, the system calculates if a tile is physically adjacent to its original "neighbour" tiles.
* **Win Condition:** The game is won only when `shuffled_tiles_array_res.every(tile => tile.currentIndex === tile.correctIndex)` returns true.

---

### 💻 Tech Stack

* **Languages:** JavaScript (ES6+), HTML5, CSS3
* **APIs:** Unsplash Source API (for high-quality imagery)
* **Tools:** Git, GitHub Pages

---

### How to Play

1. Click the **Start Overlay** to begin.
2. Click and drag a tile over another to **swap** their positions.
3. Use the borders as a guide—borders disappear when two correct neighbours are placed next to each other.
4. Complete the image to unlock the next level!


### 🌐 Handling Cross-Origin (CORS) Images

A significant technical challenge when working with the HTML5 Canvas and external APIs (like Unsplash) is the "Tainted Canvas" security restriction.

* **The Problem**: By default, the browser prevents a script from reading data from a canvas if it contains images loaded from a different domain. This would have disabled certain canvas features or triggered security errors.
* **The Solution**: To resolve this, I implemented the `img.crossOrigin = "anonymous";` attribute in the `loadRandomImage()` function.
* **Technical Implementation**: This tells the browser to request the image with CORS headers, allowing the canvas to process the external pixels securely as long as the host (Unsplash) permits it.




### **🚀 Future Enhancements**

* **Connected Block Movement (DFS Logic):** * Currently, when tiles are placed correctly, the internal borders disappear.
* **Upcoming:** I plan to implement a **Depth-First Search (DFS)** or **Union-Find** algorithm to group "correctly adjacent" tiles. Once grouped, the user will be able to click and drag the entire connected cluster as a single unit, rather than moving individual tiles.


* **Tweening Animations:** * Replacing the instant "snap" of tile swaps with smooth interpolation.
* Using **GSAP** or **requestAnimationFrame** to animate tiles sliding into their new positions, providing a more fluid user experience.


* **Move Counter & Timer:** * Adding a competitive layer by tracking the number of swaps and the total time taken to solve each level.
* **Mobile Touch Support:** * Implementing `touchstart`, `touchmove`, and `touchend` event listeners to ensure the canvas interaction works seamlessly on mobile and tablet devices.

