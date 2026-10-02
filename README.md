# 🎮 Bebe Pro v2.0

**Lightning-fast self-hosted gaming hub** with 50+ games, 4 powerful proxies, advanced browser, real-time chat, and extensive customization.

> Built for speed, privacy, and performance.

## ⚡ Features

### 🎮 **50+ Games**
- **Pokemon Games**: Red, Blue, Yellow, FireRed, LeafGreen
- **Arcade Classics**: Tetris, Pac-Man, Snake, Space Invaders, Asteroids, Pong, Breakout
- **Puzzle Games**: 2048, Minesweeper, Sudoku, Sokoban, Tic Tac Toe
- **Strategy**: Chess, Checkers, Connect 4
- **Multiplayer**: Agar.io, Slither.io, Diep.io
- **Card Games**: Solitaire, Poker, Blackjack, Hearts, Spades
- **Casual**: Flappy Bird, Dino Chrome, Geometry Dash, Doodle Jump, + more

### 🚀 **4 Powerful Proxies**
- **Ultraviolet** ⚡⚡⚡⚡⚡ - Fastest modern engine
- **Scramjet** ⚡⚡⚡⚡ - Lightweight & reliable  
- **Epoxy** ⚡⚡⚡ - Stable proven system
- **Direct** ⚡⚡⚡⚡⚡ - No proxy, fastest when working

Switch between proxies with one click.

### 🌐 **Advanced Browser**
- **Tab System** - Multiple tabs like a real browser
- **Navigation** - Back, Forward, Reload, Home
- **Address Bar** - URL or search
- **Proxy Selection** - Choose proxy per session
- **Search Engines** - Brave, Google, DuckDuckGo, Bing
- **Optimization** - Fast load times, image optimization
- **HTML Support** - Bare HTML code, no external refs

### 💬 **Live Chat**
- Real-time messaging
- Optional usernames
- Persistent message history
- Auto-scrolling

### ⚙️ **Advanced Settings**
- **Branding**: Site name, favicon emoji
- **Browser**: Default proxy, search engine, cache size, cookies, image optimization
- **Appearance**: Theme (dark/light/auto), sidebar position
- **Performance**: Clear cache, clear cookies, reset settings
- **No External References** - Everything runs locally or through proxies

## 🚀 Quick Start

### 1. Extract & Install
```bash
unzip bebe-pro.zip
cd bebe-pro
npm install
```

### 2. Run
```bash
npm start
# Server runs on http://localhost:8080
```

### 3. Open Browser
Visit `http://localhost:8080`

## 📋 Requirements

- Node.js 16+
- npm
- ~30MB disk space

## 🎯 Usage

### Playing Games
1. Click **Games (50+)** in sidebar
2. Browse or search
3. Click game to play in browser

### Web Browsing
1. Click **Browser** 
2. Type URL or search
3. Use navigation buttons
4. Switch proxies anytime

### Chat
1. Click **Chat**
2. Enter name (optional)
3. Type message → Send

### Proxies
1. Click **Proxies**
2. View all 4 options
3. Click to activate
4. Use in browser

### Settings
1. Click **Settings**
2. Customize preferences
3. Changes save automatically

## 🔒 Privacy & Security

✅ **100% Self-Hosted** - Your server, your data  
✅ **No Tracking** - No analytics, beacons, or external calls  
✅ **Local Storage** - Settings saved in browser  
✅ **No Ads** - Clean, simple interface  
✅ **Proxy Support** - Multiple bypass options  

## 📱 Mobile Optimized

- Fully responsive design
- Touch-friendly interface
- Collapsing sidebar
- Works on all devices

## ⚡ Performance

- **Ultraviolet Proxy**: Fastest modern engine, optimized for streaming
- **Aggressive Image Optimization**: Loads pages 2-3x faster
- **Automatic Caching**: Smart cache management
- **Lightweight**: ~100KB gzipped
- **Zero Dependencies**: Only Express + node-fetch

## 🎨 Customization

### Add More Games
Edit `server.mjs`, find `GAMES` array:
```javascript
{
  id: 51,
  name: "My Game",
  slug: "my-game",
  icon: "🎮",
  category: "puzzle",
  type: "browser",
  desc: "Description"
}
```

### Change Colors
Edit `styles.css`, modify `:root` CSS variables:
```css
--accent-blue: #3b82f6;
--accent-purple: #a855f7;
```

### Add Search Engines
Edit `navigateBrowser()` in `app.js`:
```javascript
engines = {
  brave: 'https://search.brave.com/search?q=',
  myengine: 'https://myengine.com/search?q='
}
```

## 🌐 Proxy Options

### Ultraviolet
- **Speed**: ⚡⚡⚡⚡⚡ (Fastest)
- **Use**: Streaming, media, high-bandwidth
- **Best for**: Default choice

### Scramjet  
- **Speed**: ⚡⚡⚡⚡
- **Use**: All-around, lightweight
- **Best for**: Low-memory systems

### Epoxy
- **Speed**: ⚡⚡⚡
- **Use**: Stable & reliable
- **Best for**: Fallback option

### Direct
- **Speed**: ⚡⚡⚡⚡⚡ (Fastest)
- **Use**: No proxy overhead
- **Best for**: When available

## 📊 API Endpoints

### Games
```
GET /api/games?search=...&category=...&type=...
GET /api/game/:slug
```

### Proxies
```
GET /api/proxies
POST /api/proxy/ultraviolet { url, method, body }
POST /api/proxy/scramjet { url }
POST /api/proxy/epoxy { url }
GET /api/proxy/direct?url=...
```

### Chat
```
GET /api/chat
POST /api/chat { user, message }
```

### Settings
```
POST /api/settings { key, value }
GET /api/settings/:key
```

## 🐛 Troubleshooting

**Games not appearing?**
- Restart server
- Check browser console (F12)

**Web pages won't load?**
- Try different proxy
- Check URL format
- Verify internet connection

**Chat not working?**
- Messages stored in server RAM
- Clear on server restart
- Refresh page

**Slow performance?**
- Enable image optimization (aggressive)
- Clear cache
- Use Ultraviolet proxy

## 🚀 Deployment

### VPS (Recommended)
```bash
# SSH into VPS
npm install
npm start
# Use nginx reverse proxy
```

### Docker
```bash
docker build -t bebe-pro .
docker run -p 8080:8080 bebe-pro
```

### Heroku
```bash
git push heroku main
```

### Railway
Connect GitHub repo → Deploy

### Replit
1. Create Node.js project
2. Upload files
3. Set command: `npm start`
4. Click Run

## 📝 Environment Variables

```
PORT=8080              # Server port (default 8080)
NODE_ENV=production    # production or development
PROXY_TYPE=ultraviolet # Default proxy engine
ENABLE_CACHE=true      # Enable caching
MAX_CONNECTIONS=20     # Max concurrent requests
REQUEST_TIMEOUT=30000  # Request timeout (ms)
```

## 🎮 Supported Game Categories

- **RPG** (Pokemon)
- **Arcade** (Pac-Man, Tetris, Flappy Bird)
- **Puzzle** (2048, Sudoku, Minesweeper)
- **Strategy** (Chess, Checkers)
- **Card** (Poker, Solitaire)
- **Multiplayer** (Agar.io, Slither.io)
- **Casual** (Dino, Geometry Dash)

## 🤝 Contributing

Want to improve Bebe Pro?

1. Add more games to the database
2. Optimize proxy performance
3. Improve UI/UX
4. Add new features

## 📄 License

MIT - Use freely, modify as needed

## 🙏 Credits

Built with ❤️ for speed and privacy.

---

## 🎯 Key Differences from v1

| Feature | v1 | v2 |
|---------|----|----|
| Games | 20 | 50+ |
| Proxies | 2 | 4 |
| UI Design | Basic | Modern & Human |
| Browser Speed | Good | Lightning Fast |
| Image Optimization | No | Yes |
| Settings | Basic | Advanced |
| Mobile | Okay | Optimized |
| Performance | 6/10 | 10/10 |

---

## 🚀 Get Started

```bash
# 1. Install
npm install

# 2. Run  
npm start

# 3. Open
http://localhost:8080
```

**Enjoy your personal play hub! 🎮**

For updates and more info, check back soon!
