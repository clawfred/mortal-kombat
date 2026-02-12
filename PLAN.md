# Mortal Kombat Web Game - Technical Plan

## Project Overview
Build a high-quality 2D fighting game inspired by Mortal Kombat for web browsers.

## Core Requirements

### 1. Game Mechanics
- **Movement System**
  - Walk left/right
  - Jump (with arc physics)
  - Crouch
  - Block (standing and crouching)

- **Attack System**
  - Light punch
  - Heavy punch
  - Light kick
  - Heavy kick
  - Special moves (2-3 per character)
  - Combo system (chain attacks)

- **Combat Mechanics**
  - Hit detection and hitboxes
  - Damage system
  - Block system (reduce damage)
  - Stun/hitstun on successful hits
  - Health bars (starts at 100%)
  - Round system (best of 3)

### 2. Characters
**Initial Roster: 2 Characters**
- Character 1: "Scorpion-inspired" - fast, ninja-style
  - Special: Spear pull
  - Special: Teleport punch
  - Special: Fire breath
  
- Character 2: "Sub-Zero-inspired" - defensive, ice-based
  - Special: Ice ball (freeze opponent)
  - Special: Slide kick
  - Special: Ice clone

### 3. Visual Design
- **Art Style**: Pixel art sprites
- **Character dimensions**: 64x64 base sprite
- **Animation frames**:
  - Idle: 4 frames
  - Walk: 6 frames
  - Jump: 4 frames
  - Punch: 3 frames
  - Kick: 3 frames
  - Block: 1 frame
  - Hit reaction: 2 frames
  - Special moves: 4-6 frames each
  - Victory: 4 frames
  - Defeat: 3 frames

- **Stage**: Simple arena with background layers

### 4. User Interface
- **Main Menu**
  - Start Game
  - Controls
  - Credits

- **Character Select**
  - 2 character portraits
  - Player 1/Player 2indicators
  - Confirm selection

- **Fight Screen**
  - Health bars (top corners)
  - Round indicators
  - Character names
  - Timer (99 seconds)
  - "FIGHT!" / "FINISH HIM!" text overlays

- **Results Screen**
  - Winner announcement
  - Score/stats
  - Rematch/Menu options

### 5. Controls
**Player 1 (Keyboard)**
- Arrow Keys: Movement
- A: Light Punch
- S: Heavy Punch
- D: Light Kick
- F: Heavy Kick
- Space: Block

**Player 2 (Keyboard)**
- WASD: Movement
- J: Light Punch
- K: Heavy Punch
- L: Light Kick
- ;: Heavy Kick
- Shift: Block

**Special Moves**: Directional combos (e.g., Down + Forward + Punch)

### 6. AI System (for single-player)
- **Difficulty Levels**: Easy, Medium, Hard
- **AI Behaviors**:
  - Distance management
  - Attack patterns
  - Block timing
  - Counter-attack windows
  - Special move usage

### 7. Sound Design
- Background music (8-bit style)
- Hit sounds (punch, kick impacts)
- Special move sounds
- Voice samples ("Fight!", "Finish Him!", "Fatality!")
- Victory/defeat music

## Technical Architecture

### File Structure
```
mortal-kombat/
├── index.html          # Main HTML file
├── styles.css          # Styling
├── game.js            # Main game logic
├── characters.js      # Character definitions
├── physics.js         # Physics and collision
├── ai.js             # AI behavior
├── input.js          # Input handling
├── renderer.js       # Canvas rendering
├── audio.js          # Sound management
├── assets/
│   ├── sprites/      # Character sprites
│   ├── backgrounds/  # Stage backgrounds
│   └── sounds/       # Audio files
└── README.md
```

### Core Systems

#### 1. Game State Manager
```javascript
States: {
  MENU,
  CHARACTER_SELECT,
  FIGHT_INTRO,
  FIGHTING,
  ROUND_END,
  FIGHT_END
}
```

#### 2. Character Class
```javascript
Character {
  position: {x, y}
  velocity: {x, y}
  health: 100
  state: IDLE/WALKING/JUMPING/ATTACKING/BLOCKING/HIT
  currentAnimation: Animation
  hitbox: Rectangle
  hurtbox: Rectangle
  facingRight: boolean
  
  methods:
    move()
    attack()
    block()
    takeDamage()
    updateAnimation()
}
```

#### 3. Physics System
- Gravity constant
- Jump velocity
- Ground detection
- Collision detection (AABB)
- Pushback on hit

#### 4. Animation System
```javascript
Animation {
  frames: SpriteFrame[]
  currentFrame: number
  frameDelay: number
  loop: boolean
  
  methods:
    update()
    reset()
}
```

#### 5. Combat System
- Attack priority (light < heavy < special)
- Hitstun duration based on attack strength
- Combo counter
- Damage calculation
- Block reduction (50% damage)

## Development Phases

### Phase 1: Core Engine (Foundation)
1. Set up HTML5 Canvas
2. Implement game loop
3. Create basic sprite renderer
4. Build input system
5. Implement physics (gravity, movement)

### Phase 2: Character System
1. Create Character class
2. Implement basic animations (idle, walk, jump)
3. Add attack animations and hitboxes
4. Implement blocking
5. Add special moves

### Phase 3: Combat Mechanics
1. Hit detection system
2. Damage calculation
3. Health bars
4. Hitstun/knockback
5. Round system

### Phase 4: AI Opponent
1. Basic AI movement
2. Attack decision tree
3. Block timing
4. Difficulty scaling

### Phase 5: UI/UX
1. Main menu
2. Character select screen
3. Fight HUD
4. Victory/defeat screens
5. Transitions and effects

### Phase 6: Polish
1. Sound effects
2. Background music
3. Particle effects (blood, impacts)
4. Screen shake
5. Fatality system (optional)

### Phase 7: Testing & Optimization
1. Balance testing
2. Bug fixes
3. Performance optimization
4. Mobile responsiveness

## Graphics Creation Strategy

### Option 1: Pixel Art (Recommended)
- Create simple 64x64 character sprites
- Use geometric shapes and limited colors
- Focus on clear silhouettes and readable animations
- Tools: Can generate programmatically or use canvas drawing

### Option 2: Geometric Shapes
- Use canvas primitives (rectangles, circles)
- Color-coded for different body parts
- Faster to implement but less polished

**Decision**: Start with geometric shapes for prototype, upgrade to pixel art if time permits.

## Performance Targets
- 60 FPS on modern browsers
- < 5MB total asset size
- Responsive on desktop and tablet

## Success Criteria
1. ✅ Smooth 60fps gameplay
2. ✅ Responsive controls with no input lag
3. ✅ Clear hit feedback
4. ✅ Balanced combat (no infinite combos)
5. ✅ Functional AI opponent
6. ✅ Complete game loop (menu → fight → results)
7. ✅ Mobile-friendly UI

## Timeline Estimate
- Phase 1-3: Core gameplay (main focus)
- Phase 4: AI (necessary for single-player)
- Phase 5-6: Polish (time permitting)
- Total: Build for quality, not speed

## Notes
- Prioritize gameplay feel over graphics fidelity
- Ensure tight hit detection and responsive controls
- Test combat balance frequently
- Keep code modular for easy iteration
