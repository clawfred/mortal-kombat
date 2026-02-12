# Mortal Kombat Web Game

A complete 2D fighting game inspired by Mortal Kombat, built with vanilla JavaScript and HTML5 Canvas.

## 🎮 Play Now

**Live Demo:** https://skill-deploy-r0fx3fofn6-agent-skill-vercel.vercel.app

## ✨ Features

### Core Gameplay
- **2 Playable Characters**: Scorpion-inspired and Sub-Zero-inspired fighters
- **Full Combat System**:
  - Light Punch (5 damage)
  - Heavy Punch (12 damage)
  - Light Kick (7 damage)
  - Heavy Kick (15 damage)
  - Blocking (reduces damage by 70%)
- **Movement**: Walk, jump, crouch
- **Round System**: Best of 3 rounds
- **Health & Timer**: 100 HP per fighter, 99-second timer per round

### Combat Mechanics
- **Hit Detection**: Precise hitbox/hurtbox collision system
- **Hitstun**: Fighters are stunned when hit, preventing instant counter-attacks
- **Knockback**: Realistic knockback on successful hits
- **Block System**: Face opponent and hold block to reduce damage
- **Attack Recovery**: Frame-based attack system prevents spamming

### Visual Polish
- **Animated Fighters**: Unique animations for idle, walking, jumping, crouching, attacking, blocking, getting hit, and defeat
- **Stage Design**: Atmospheric arena with mountain backdrop
- **UI Effects**: Health bar color changes, attack trails, hit flashes, block effects
- **Mortal Kombat Aesthetic**: Gold and red color scheme with shadow effects

## 🎮 Controls

### Player 1 (Keyboard)
- **Arrow Keys**: Move (Left/Right/Up/Down)
- **A**: Light Punch
- **S**: Heavy Punch
- **D**: Light Kick
- **F**: Heavy Kick
- **Space**: Block

### Player 2 (Keyboard)
- **WASD**: Move
- **J**: Light Punch
- **K**: Heavy Punch
- **L**: Light Kick
- **;** (Semicolon): Heavy Kick
- **Shift**: Block

## 🏗️ Architecture

### Modular Design
The game is built with a clean, modular architecture:

- **`game.js`**: Main game loop and state manager
- **`fighter.js`**: Character class with combat logic
- **`physics.js`**: Gravity, collision detection, and hit detection
- **`input.js`**: Dual-player keyboard input handling
- **`renderer.js`**: Canvas rendering and animations
- **`stage.js`**: Background and arena rendering

### Technical Highlights
- **60fps game loop** with delta time
- **AABB collision detection** for hits and overlaps
- **State machine** for fighter animations
- **Frame-based attack system** for balanced combat
- **ES6 modules** for clean code organization

## 🎨 Game States

1. **Menu**: Start screen with options
2. **Character Select**: Choose your fighter (2 players)
3. **Fighting**: Active combat with full mechanics
4. **Round End**: Winner announcement, round counter update
5. **Fight End**: Match winner, return to menu

## 🎯 Combat Balance

### Attack Properties
| Move | Damage | Hitstun | Active Frames | Recovery Frames |
|------|--------|---------|---------------|-----------------|
| Light Punch | 5 | 0.2s | 8 | 5 |
| Heavy Punch | 12 | 0.4s | 15 | 12 |
| Light Kick | 7 | 0.25s | 10 | 7 |
| Heavy Kick | 15 | 0.5s | 20 | 15 |

### Blocking
- Reduces damage to 30% of original
- Must face opponent to block effectively
- Creates blockstun (50% of normal hitstun)

## 🚀 Development

Built with **quality over speed** approach:
- ✅ Complete game loop (menu → fight → results)
- ✅ Responsive controls with no input lag
- ✅ Tight hit detection
- ✅ Smooth 60fps animation
- ✅ Balanced combat mechanics
- ✅ Polished UI with MK aesthetic

## 📁 Project Structure

```
mortal-kombat/
├── index.html          # Main HTML structure
├── styles.css          # Mortal Kombat themed styling
├── game.js            # Game state and loop
├── fighter.js         # Character class
├── physics.js         # Physics and collision
├── input.js           # Input handling
├── renderer.js        # Canvas rendering
├── stage.js           # Background rendering
├── PLAN.md            # Technical planning document
└── README.md          # This file
```

## 🎨 Character Designs

### Scorpion (Orange/Red)
- Fast, aggressive playstyle
- Orange body with red accents
- Emoji: 🦂

### Sub-Zero (Blue/Cyan)
- Defensive, ice-themed
- Blue body with cyan accents
- Emoji: ❄️

## 🔧 Future Enhancements
- [ ] Special moves (fireballs, teleports)
- [ ] Combo system
- [ ] AI opponent for single-player
- [ ] Sound effects and music
- [ ] Fatalities
- [ ] More characters
- [ ] Mobile controls
- [ ] Pixel art sprites

## 📜 License
Built as a technical demonstration. Mortal Kombat is a trademark of Warner Bros.

---

**Built by Clawfred** | [GitHub](https://github.com/clawfred/mortal-kombat)
