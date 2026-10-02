import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import fetch from "node-fetch";
import zlib from "zlib";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const PORT = Number(process.env.PORT || 8080);

app.disable("x-powered-by");
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ limit: "1mb" }));

// Security headers
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "SAMEORIGIN");
  res.setHeader("Referrer-Policy", "no-referrer");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

// ==================== EXPANDED GAMES DATABASE ====================
const GAMES = [
  // Pokemon Games
  { id: 1, name: "Pokemon Red", slug: "pokemon-red", icon: "🔴", category: "rpg", type: "pokemon", desc: "Classic Pokemon adventure in Kanto" },
  { id: 2, name: "Pokemon Blue", slug: "pokemon-blue", icon: "🔵", category: "rpg", type: "pokemon", desc: "Blue version with different Pokemon" },
  { id: 3, name: "Pokemon Yellow", slug: "pokemon-yellow", icon: "⚡", category: "rpg", type: "pokemon", desc: "Pikachu starter adventure" },
  { id: 4, name: "Pokemon FireRed", slug: "pokemon-firered", icon: "🔥", category: "rpg", type: "pokemon", desc: "Enhanced Kanto region remake" },
  { id: 5, name: "Pokemon LeafGreen", slug: "pokemon-leafgreen", icon: "🍃", category: "rpg", type: "pokemon", desc: "Green version remake" },
  
  // Popular Browser Games
  { id: 6, name: "Tetris", slug: "tetris", icon: "🧱", category: "puzzle", type: "classic", desc: "The original block game" },
  { id: 7, name: "2048", slug: "2048", icon: "🔢", category: "puzzle", type: "casual", desc: "Merge tiles to 2048" },
  { id: 8, name: "Pac-Man", slug: "pac-man", icon: "👻", category: "arcade", type: "classic", desc: "Guide Pac-Man through mazes" },
  { id: 9, name: "Snake", slug: "snake", icon: "🐍", category: "arcade", type: "classic", desc: "Grow your snake" },
  { id: 10, name: "Flappy Bird", slug: "flappy-bird", icon: "🐦", category: "arcade", type: "casual", desc: "Navigate through pipes" },
  { id: 11, name: "Dino Chrome", slug: "dino-chrome", icon: "🦕", category: "arcade", type: "casual", desc: "Jump over obstacles" },
  { id: 12, name: "Wordle", slug: "wordle", icon: "🎯", category: "word", type: "casual", desc: "Guess the 5-letter word" },
  { id: 13, name: "Chess", slug: "chess", icon: "♟️", category: "strategy", type: "classic", desc: "Play chess vs AI" },
  { id: 14, name: "Checkers", slug: "checkers", icon: "⚫", category: "strategy", type: "classic", desc: "Classic checkers game" },
  { id: 15, name: "Connect 4", slug: "connect4", icon: "🔴", category: "strategy", type: "classic", desc: "Four in a row" },
  
  // Arcade Classics
  { id: 16, name: "Space Invaders", slug: "space-invaders", icon: "👾", category: "arcade", type: "classic", desc: "Defend against aliens" },
  { id: 17, name: "Asteroids", slug: "asteroids", icon: "☄️", category: "arcade", type: "classic", desc: "Shoot asteroids" },
  { id: 18, name: "Pong", slug: "pong", icon: "🎾", category: "arcade", type: "classic", desc: "Bounce the ball" },
  { id: 19, name: "Breakout", slug: "breakout", icon: "🧱", category: "arcade", type: "classic", desc: "Break the bricks" },
  { id: 20, name: "Galaga", slug: "galaga", icon: "🚀", category: "arcade", type: "classic", desc: "Shoot the invaders" },
  
  // Puzzle Games
  { id: 21, name: "Minesweeper", slug: "minesweeper", icon: "💣", category: "puzzle", type: "casual", desc: "Uncover safe tiles" },
  { id: 22, name: "Sudoku", slug: "sudoku", icon: "🔐", category: "puzzle", type: "casual", desc: "Number puzzle" },
  { id: 23, name: "Sokoban", slug: "sokoban", icon: "📦", category: "puzzle", type: "casual", desc: "Push boxes to goal" },
  { id: 24, name: "Tic Tac Toe", slug: "tictactoe", icon: "⭕", category: "puzzle", type: "casual", desc: "Classic three in a row" },
  { id: 25, name: "15 Puzzle", slug: "15-puzzle", icon: "🎲", category: "puzzle", type: "casual", desc: "Slide tiles puzzle" },
  
  // Multiplayer Games
  { id: 26, name: "Agar.io", slug: "agar-io", icon: "🔵", category: "multiplayer", type: "browser", desc: "Eat smaller cells" },
  { id: 27, name: "Slither.io", slug: "slither-io", icon: "🐍", category: "multiplayer", type: "browser", desc: "Grow your snake" },
  { id: 28, name: "Diep.io", slug: "diep-io", icon: "🎱", category: "multiplayer", type: "browser", desc: "Tank shooting game" },
  { id: 29, name: "Io Games Hub", slug: "io-games", icon: "🎮", category: "multiplayer", type: "browser", desc: "Play .io games" },
  
  // Card Games
  { id: 30, name: "Solitaire", slug: "solitaire", icon: "♠️", category: "card", type: "classic", desc: "Classic card game" },
  { id: 31, name: "Poker", slug: "poker", icon: "🃏", category: "card", type: "classic", desc: "Texas Hold'em" },
  { id: 32, name: "Blackjack", slug: "blackjack", icon: "🎰", category: "card", type: "classic", desc: "Beat the dealer" },
  { id: 33, name: "Hearts", slug: "hearts", icon: "❤️", category: "card", type: "classic", desc: "Avoid the heart cards" },
  { id: 34, name: "Spades", slug: "spades", icon: "♣️", category: "card", type: "classic", desc: "Trump card game" },
  
  // Browser Games
  { id: 35, name: "Chrome Dino", slug: "chrome-dino", icon: "🦖", category: "arcade", type: "casual", desc: "Offline dino game" },
  { id: 36, name: "Geometry Dash", slug: "geometry-dash", icon: "🔷", category: "arcade", type: "casual", desc: "Rhythm platformer" },
  { id: 37, name: "Doodle Jump", slug: "doodle-jump", icon: "📝", category: "arcade", type: "casual", desc: "Jump upward" },
  { id: 38, name: "Stick Hero", slug: "stick-hero", icon: "🎯", category: "arcade", type: "casual", desc: "Extend the stick" },
  { id: 39, name: "2D Car Racing", slug: "car-racing", icon: "🏎️", category: "arcade", type: "casual", desc: "Simple racing game" },
  { id: 40, name: "Zombie Survival", slug: "zombie-survival", icon: "🧟", category: "shooter", type: "casual", desc: "Survive the zombies" },
  
  // Retro Games
  { id: 41, name: "Frogger", slug: "frogger", icon: "🐸", category: "arcade", type: "classic", desc: "Cross the road" },
  { id: 42, name: "Donkey Kong", slug: "donkey-kong", icon: "🦍", category: "arcade", type: "classic", desc: "Dodge barrels" },
  { id: 43, name: "Ms Pac-Man", slug: "ms-pacman", icon: "👸", category: "arcade", type: "classic", desc: "Female Pac-Man" },
  { id: 44, name: "Centipede", slug: "centipede", icon: "🐛", category: "arcade", type: "classic", desc: "Shoot the centipede" },
  { id: 45, name: "Missile Command", slug: "missile-command", icon: "🚀", category: "arcade", type: "classic", desc: "Defend your city" },
  
  // Casual Games
  { id: 46, name: "Flappy Wings", slug: "flappy-wings", icon: "🦅", category: "arcade", type: "casual", desc: "Fly through pipes" },
  { id: 47, name: "Swing Game", slug: "swing-game", icon: "🎪", category: "arcade", type: "casual", desc: "Swing as far as you can" },
  { id: 48, name: "Ball Maze", slug: "ball-maze", icon: "🏀", category: "puzzle", type: "casual", desc: "Roll ball to goal" },
  { id: 49, name: "Number Match", slug: "number-match", icon: "🔢", category: "puzzle", type: "casual", desc: "Match the numbers" },
  { id: 50, name: "Bubble Shooter", slug: "bubble-shooter", icon: "🫧", category: "puzzle", type: "casual", desc: "Shoot colored bubbles" },
];

// ==================== PROXY MANAGER ====================
const PROXIES = {
  ultraviolet: {
    name: "Ultraviolet",
    id: "ultraviolet",
    speed: "⚡⚡⚡⚡⚡",
    desc: "Fastest modern proxy engine",
    endpoint: "/api/proxy/ultraviolet"
  },
  scramjet: {
    name: "Scramjet",
    id: "scramjet",
    speed: "⚡⚡⚡⚡",
    desc: "High-speed lightweight proxy",
    endpoint: "/api/proxy/scramjet"
  },
  epoxy: {
    name: "Epoxy",
    id: "epoxy",
    speed: "⚡⚡⚡",
    desc: "Stable and reliable",
    endpoint: "/api/proxy/epoxy"
  },
  direct: {
    name: "Direct (No Proxy)",
    id: "direct",
    speed: "⚡⚡⚡⚡⚡",
    desc: "No proxy - fastest when working",
    endpoint: "/api/proxy/direct"
  }
};

// ==================== GAME DATABASE ====================
app.get("/api/games", (req, res) => {
  const { search, category, type } = req.query;
  let games = GAMES;

  if (search) {
    const q = search.toLowerCase();
    games = games.filter(g => 
      g.name.toLowerCase().includes(q) || 
      g.desc.toLowerCase().includes(q)
    );
  }

  if (category) {
    games = games.filter(g => g.category === category);
  }

  if (type) {
    games = games.filter(g => g.type === type);
  }

  const categories = [...new Set(GAMES.map(g => g.category))].sort();
  const types = [...new Set(GAMES.map(g => g.type))].sort();

  res.json({
    games,
    total: games.length,
    categories,
    types,
    allGames: GAMES.length
  });
});

app.get("/api/game/:slug", (req, res) => {
  const game = GAMES.find(g => g.slug === req.params.slug);
  if (!game) return res.status(404).json({ error: "Game not found" });
  res.json(game);
});

// ==================== PROXIES ====================
app.get("/api/proxies", (req, res) => {
  res.json(Object.values(PROXIES));
});

// Ultraviolet Proxy (fastest)
app.post("/api/proxy/ultraviolet", async (req, res) => {
  try {
    const { url, method = "GET", body } = req.body;
    if (!url) return res.status(400).json({ error: "Missing URL" });

    const opts = {
      method,
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
      },
      timeout: 10000
    };

    if (body) opts.body = body;

    const response = await fetch(url, opts);
    const content = await response.buffer();

    res.setHeader("Content-Type", response.headers.get("content-type") || "text/html");
    res.setHeader("X-Proxy-Via", "ultraviolet");
    res.send(content);
  } catch (error) {
    res.status(502).json({ error: error.message });
  }
});

// Scramjet Proxy
app.post("/api/proxy/scramjet", async (req, res) => {
  try {
    const { url } = req.body;
    if (!url) return res.status(400).json({ error: "Missing URL" });

    const response = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0" }
    });

    const content = await response.text();
    res.setHeader("X-Proxy-Via", "scramjet");
    res.send(content);
  } catch (error) {
    res.status(502).json({ error: error.message });
  }
});

// Epoxy Proxy
app.post("/api/proxy/epoxy", async (req, res) => {
  try {
    const { url } = req.body;
    if (!url) return res.status(400).json({ error: "Missing URL" });

    const response = await fetch(url);
    const content = await response.text();
    res.setHeader("X-Proxy-Via", "epoxy");
    res.json({ success: true, content });
  } catch (error) {
    res.status(502).json({ error: error.message });
  }
});

// Direct (no proxy)
app.get("/api/proxy/direct", async (req, res) => {
  const { url } = req.query;
  if (!url) return res.status(400).json({ error: "Missing URL" });

  try {
    const response = await fetch(decodeURIComponent(url));
    const content = await response.buffer();
    res.setHeader("Content-Type", response.headers.get("content-type") || "text/html");
    res.setHeader("X-Proxy-Via", "direct");
    res.send(content);
  } catch (error) {
    res.status(502).json({ error: error.message });
  }
});

// ==================== CHAT ====================
const chatMessages = [];

app.get("/api/chat", (req, res) => {
  res.json({ messages: chatMessages.slice(-100) });
});

app.post("/api/chat", (req, res) => {
  const { user, message } = req.body;
  if (!message) return res.status(400).json({ error: "Missing message" });

  const msg = {
    id: Date.now(),
    user: user || "Guest",
    message: String(message).slice(0, 500),
    timestamp: new Date().toISOString()
  };

  chatMessages.push(msg);
  res.json(msg);
});

// ==================== SETTINGS ====================
const settings = new Map();

app.post("/api/settings", (req, res) => {
  const { key, value } = req.body;
  if (!key) return res.status(400).json({ error: "Missing key" });
  settings.set(key, value);
  res.json({ success: true, key, value });
});

app.get("/api/settings/:key", (req, res) => {
  const value = settings.get(req.params.key);
  res.json({ key: req.params.key, value });
});

// ==================== BROWSER OPTIMIZATION ====================
app.get("/api/browser-config", (req, res) => {
  res.json({
    cacheEnabled: true,
    compressionEnabled: true,
    cookiesEnabled: true,
    jsEnabled: true,
    cssEnabled: true,
    imageOptimization: "aggressive",
    maxConnections: 10,
    timeout: 30000
  });
});

// ==================== STATIC FILES ====================
app.use(express.static(path.join(__dirname, "public"), {
  maxAge: "365d",
  etag: false,
  setHeaders(res, filePath) {
    if (filePath.endsWith(".html")) {
      res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
    } else if (filePath.endsWith(".js") || filePath.endsWith(".css")) {
      res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
    }
  }
}));

app.get(/.*/, (_req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`
╔════════════════════════════════════════════╗
║   🎮 BEBE PRO is running                   ║
║   http://localhost:${PORT}                        ║
║   50+ games • 4 proxies • Lightning fast   ║
╚════════════════════════════════════════════╝
  `);
});
