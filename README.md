# 🐟 Feeding Frenzy Game

A classic fish-eat-fish browser game inspired by the original Feeding Frenzy. Control your fish, eat smaller fish to grow bigger, and survive the dangers of the deep sea!

![Game Screenshot](assets/backgrounds/favicon.png)

## 🎮 How to Play

1. **Open the game** - Simply open `index.html` in your browser
2. **Control your fish** - Move your mouse to guide your fish
3. **Eat smaller fish** - Gain points and grow bigger
4. **Avoid larger fish** - They will eat you!
5. **Reach 650 points** - Win the game and unlock Endless Mode

## ✨ Features

### Core Gameplay

- **Mouse-controlled player fish** - Smooth, responsive movement following your cursor
- **Level progression system** - Grow through 4 levels (Tiny → Small → Medium → Large)
- **Dynamic fish spawning** - Enemy fish spawn with weighted probability based on player level
- **Fish-eat-fish mechanics** - Eat fish at your level or smaller, avoid bigger ones
- **Score system** - Earn 10 points per fish eaten
- **High score persistence** - Your best score is saved locally

### Enemy Types

| Level | Fish         | Description                               |
| ----- | ------------ | ----------------------------------------- |
| 0     | Tiny Fry     | Smallest fish, easy prey                  |
| 1     | Swift Minnow | Fast and slippery                         |
| 2     | Spotted Reef | Larger, more dangerous                    |
| 3     | Hunter       | Predator fish                             |
| Boss  | Apex         | **INVINCIBLE** boss - avoid at all costs! |

### Hazards

- **Shark (Eng. Mahmoud)** - A deadly predator that appears with warning. Avoid at all costs!
- **Bombs** - Fall from above and explode on contact. Stay clear!

### Game Modes

- **Story Mode** - Interactive story introduction with character backgrounds
- **Normal Mode** - Reach 650 points to win
- **Endless Mode** - Unlocked after winning, survive as long as possible with increasing difficulty

### Sound & Music

- Background music during gameplay
- Sound effects for eating fish, level ups, explosions
- Victory and game over sounds
- **Mute controls** - Toggle music and sound effects independently

### Visual Effects

- Animated underwater video background
- Level-up announcements
- Score popup effects when eating fish
- Progress bar with level checkpoints
- Shark warning system with visual alerts
- Smooth fish animations (mouth open/close)

## 🚀 Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, Edge)
- No installation or dependencies required!

### Running the Game

1. Clone or download this repository
2. Open `index.html` in your browser
3. Enjoy the game!

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/Feeding-Frenzy-Game.git

# Navigate to the game directory
cd Feeding-Frenzy-Game

# Open in browser (or just double-click index.html)
open index.html
```

## 📁 Project Structure

```
Feeding-Frenzy-Game/
├── index.html          # Main HTML file
├── style.css           # Game styling and animations
├── js/
│   ├── main.js         # Game initialization
│   ├── Game.js         # Main game logic and loop
│   ├── Fish.js         # Base fish class
│   ├── Player.js       # Player-controlled fish
│   ├── EnemyFish.js    # Enemy fish behavior
│   ├── Spawner.js      # Enemy spawning system
│   ├── Shark.js        # Shark hazard
│   └── Bomb.js         # Bomb hazard
├── config/
│   └── config.js       # Game configuration and settings
└── assets/
    ├── characters/     # Fish and enemy sprites
    ├── audio/          # Sound effects and music
    └── backgrounds/    # Background video and images
```

## ⚙️ Configuration

Game settings can be adjusted in `config/config.js`:

- **Player settings** - Starting size, growth rate, acceleration
- **Level thresholds** - Points needed to level up
- **Shark settings** - Spawn interval, speed, warning duration
- **Bomb settings** - Spawn interval, fall speed
- **Win threshold** - Points needed to complete the game (default: 650)

## 🎵 Audio Credits

The game includes:

- Background music
- Eating sound effects
- Level up sounds
- Victory fanfare
- Game over sound
- Bomb explosion sound

## 🛠️ Technology Stack

- **HTML5** - Game structure
- **CSS3** - Animations and styling
- **Vanilla JavaScript** - Game logic (ES6 modules)
- **LocalStorage** - High score persistence

## 📝 License

This project is for educational purposes.

## 🙏 Acknowledgments

- Inspired by the classic Feeding Frenzy game by PopCap Games
- Character designs and assets created for this project
