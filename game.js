// Main game controller
import { InputManager } from './input.js';
import { Renderer } from './renderer.js';
import { Physics } from './physics.js';
import { Fighter } from './fighter.js';
import { Stage } from './stage.js';

class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        
        // Set canvas size based on device
        this.setupCanvas();
        
        // Initialize systems
        this.input = new InputManager();
        this.renderer = new Renderer(this.ctx, this.canvas.width, this.canvas.height);
        this.physics = new Physics();
        this.stage = new Stage(this.canvas.width, this.canvas.height);
        
        // Handle resize
        window.addEventListener('resize', () => this.handleResize());
        
        // Game state
        this.state = 'MENU'; // MENU, CHARACTER_SELECT, FIGHTING, ROUND_END, FIGHT_END
        this.fighters = [];
        this.selectedCharacters = { p1: null, p2: null };
        this.roundNumber = 1;
        this.roundsWon = { p1: 0, p2: 0 };
        this.timer = 99;
        this.timerInterval = null;
        
        // UI elements
        this.initUI();
        
        // Start game loop
        this.lastTime = 0;
        this.gameLoop = this.gameLoop.bind(this);
        requestAnimationFrame(this.gameLoop);
    }
    
    setupCanvas() {
        const isMobile = window.innerWidth <= 768;
        
        if (isMobile) {
            // Mobile: use full screen width, leave space for controls
            this.canvas.width = Math.min(window.innerWidth, 800);
            this.canvas.height = Math.min(window.innerHeight - 200, 500);
        } else {
            // Desktop: standard size
            this.canvas.width = 1280;
            this.canvas.height = 720;
        }
        
        // Update renderer and stage if they exist
        if (this.renderer) {
            this.renderer.width = this.canvas.width;
            this.renderer.height = this.canvas.height;
        }
        if (this.stage) {
            this.stage.width = this.canvas.width;
            this.stage.height = this.canvas.height;
            this.stage.groundY = this.canvas.height - 120;
        }
    }
    
    handleResize() {
        this.setupCanvas();
        
        // Reposition fighters if in fight
        if (this.fighters.length >= 2) {
            this.fighters[0].x = Math.min(this.fighters[0].x, this.canvas.width - 100);
            this.fighters[1].x = Math.min(this.fighters[1].x, this.canvas.width - 100);
        }
    }
    
    initUI() {
        // Menu buttons
        document.getElementById('start-btn').addEventListener('click', () => {
            this.showCharacterSelect();
        });
        
        document.getElementById('controls-btn').addEventListener('click', () => {
            this.showControls();
        });
        
        document.getElementById('back-btn').addEventListener('click', () => {
            this.showMenu();
        });
        
        // Character selection
        const cards = document.querySelectorAll('.character-card');
        cards.forEach(card => {
            card.addEventListener('click', () => {
                const character = card.dataset.character;
                this.selectCharacter(character);
            });
        });
        
        // Keyboard character selection
        this.input.on('keydown', (key) => {
            if (this.state === 'CHARACTER_SELECT') {
                // P1 selects with Enter
                if (key === 'Enter' && !this.selectedCharacters.p1) {
                    const firstCard = document.querySelector('.character-card');
                    this.selectCharacter(firstCard.dataset.character, 1);
                }
                // P2 selects with Shift
                if (key === 'Shift' && !this.selectedCharacters.p2) {
                    const secondCard = document.querySelectorAll('.character-card')[1];
                    this.selectCharacter(secondCard.dataset.character, 2);
                }
            }
        });
    }
    
    showMenu() {
        this.state = 'MENU';
        document.getElementById('menu').classList.remove('hidden');
        document.getElementById('character-select').classList.add('hidden');
        document.getElementById('controls-screen').classList.add('hidden');
        
        // Hide mobile controls in menu
        if (this.input.isMobile) {
            this.input.hideMobileControls();
        }
    }
    
    showControls() {
        document.getElementById('menu').classList.add('hidden');
        document.getElementById('controls-screen').classList.remove('hidden');
    }
    
    showCharacterSelect() {
        this.state = 'CHARACTER_SELECT';
        this.selectedCharacters = { p1: null, p2: null };
        document.getElementById('menu').classList.add('hidden');
        document.getElementById('character-select').classList.remove('hidden');
        this.updateSelectionStatus();
    }
    
    selectCharacter(character, player) {
        if (!player) {
            // Auto-assign to first available player
            if (!this.selectedCharacters.p1) {
                this.selectedCharacters.p1 = character;
            } else if (!this.selectedCharacters.p2) {
                this.selectedCharacters.p2 = character;
            }
        } else {
            if (player === 1) this.selectedCharacters.p1 = character;
            if (player === 2) this.selectedCharacters.p2 = character;
        }
        
        this.updateSelectionStatus();
        
        // Start fight if both selected
        if (this.selectedCharacters.p1 && this.selectedCharacters.p2) {
            setTimeout(() => this.startFight(), 500);
        }
    }
    
    updateSelectionStatus() {
        const p1Status = document.getElementById('p1-status');
        const p2Status = document.getElementById('p2-status');
        
        p1Status.textContent = this.selectedCharacters.p1 
            ? `P1: ${this.selectedCharacters.p1.toUpperCase()}` 
            : 'P1: Not Ready';
        p2Status.textContent = this.selectedCharacters.p2 
            ? `P2: ${this.selectedCharacters.p2.toUpperCase()}` 
            : 'P2: Not Ready';
    }
    
    startFight() {
        this.state = 'FIGHTING';
        document.getElementById('character-select').classList.add('hidden');
        
        // Show mobile controls if on mobile
        if (this.input.isMobile) {
            this.input.showMobileControls();
        }
        
        // Calculate positions based on screen size
        const isMobile = window.innerWidth <= 768;
        const p1X = isMobile ? 100 : 300;
        const p2X = isMobile ? this.canvas.width - 160 : this.canvas.width - 300;
        const groundY = this.canvas.height - (isMobile ? 120 : 200);
        
        // Create fighters
        this.fighters = [
            new Fighter(
                this.selectedCharacters.p1,
                p1X,
                groundY,
                true,
                1
            ),
            new Fighter(
                this.selectedCharacters.p2,
                p2X,
                groundY,
                false,
                2
            )
        ];
        
        // Reset round data
        this.roundNumber = 1;
        this.roundsWon = { p1: 0, p2: 0 };
        this.updateRoundDisplay();
        
        // Show "ROUND 1 - FIGHT!" message
        this.showMessage('ROUND 1', 1000);
        setTimeout(() => {
            this.showMessage('FIGHT!', 1000);
            this.startTimer();
        }, 1200);
    }
    
    startTimer() {
        this.timer = 99;
        this.updateTimerDisplay();
        
        if (this.timerInterval) clearInterval(this.timerInterval);
        
        this.timerInterval = setInterval(() => {
            this.timer--;
            this.updateTimerDisplay();
            
            if (this.timer <= 0) {
                clearInterval(this.timerInterval);
                this.endRound('timeout');
            }
        }, 1000);
    }
    
    updateTimerDisplay() {
        document.getElementById('timer').textContent = this.timer;
    }
    
    updateHealthDisplay() {
        const p1Health = document.getElementById('player1-health');
        const p2Health = document.getElementById('player2-health');
        
        const p1Percent = Math.max(0, (this.fighters[0].health / this.fighters[0].maxHealth) * 100);
        const p2Percent = Math.max(0, (this.fighters[1].health / this.fighters[1].maxHealth) * 100);
        
        p1Health.style.width = p1Percent + '%';
        p2Health.style.width = p2Percent + '%';
        
        // Color based on health
        p1Health.className = 'health-bar';
        p2Health.className = 'health-bar';
        
        if (p1Percent < 30) p1Health.classList.add('critical');
        else if (p1Percent < 50) p1Health.classList.add('low');
        
        if (p2Percent < 30) p2Health.classList.add('critical');
        else if (p2Percent < 50) p2Health.classList.add('low');
    }
    
    updateRoundDisplay() {
        document.getElementById('round-text').textContent = `ROUND ${this.roundNumber}`;
        
        const p1Dots = document.querySelectorAll('#player1-rounds .round-dot');
        const p2Dots = document.querySelectorAll('#player2-rounds .round-dot');
        
        p1Dots.forEach((dot, i) => {
            dot.classList.toggle('won', i < this.roundsWon.p1);
        });
        
        p2Dots.forEach((dot, i) => {
            dot.classList.toggle('won', i < this.roundsWon.p2);
        });
    }
    
    showMessage(text, duration = 2000) {
        const message = document.getElementById('message');
        message.textContent = text;
        message.className = 'show';
        
        setTimeout(() => {
            message.className = '';
        }, duration);
    }
    
    endRound(reason) {
        clearInterval(this.timerInterval);
        this.state = 'ROUND_END';
        
        let winner;
        if (reason === 'timeout') {
            // Higher health wins
            winner = this.fighters[0].health > this.fighters[1].health ? 0 : 1;
        } else {
            // One fighter is defeated
            winner = this.fighters[0].health > 0 ? 0 : 1;
        }
        
        // Award round
        if (winner === 0) {
            this.roundsWon.p1++;
        } else {
            this.roundsWon.p2++;
        }
        
        this.updateRoundDisplay();
        
        // Check for fight end
        if (this.roundsWon.p1 === 2 || this.roundsWon.p2 === 2) {
            this.endFight(winner);
        } else {
            // Next round
            this.showMessage(`PLAYER ${winner + 1} WINS!`, 2000);
            setTimeout(() => this.startNextRound(), 3000);
        }
    }
    
    startNextRound() {
        this.roundNumber++;
        this.updateRoundDisplay();
        
        // Calculate positions based on screen size
        const isMobile = window.innerWidth <= 768;
        const p1X = isMobile ? 100 : 300;
        const p2X = isMobile ? this.canvas.width - 160 : this.canvas.width - 300;
        const groundY = this.canvas.height - (isMobile ? 120 : 200);
        
        // Reset fighters
        this.fighters[0].reset(p1X, groundY);
        this.fighters[1].reset(p2X, groundY);
        
        this.state = 'FIGHTING';
        this.showMessage(`ROUND ${this.roundNumber}`, 1000);
        setTimeout(() => {
            this.showMessage('FIGHT!', 1000);
            this.startTimer();
        }, 1200);
    }
    
    endFight(winner) {
        this.state = 'FIGHT_END';
        const winnerName = winner === 0 ? this.selectedCharacters.p1 : this.selectedCharacters.p2;
        
        this.showMessage(`${winnerName.toUpperCase()} WINS!`, 3000);
        
        setTimeout(() => {
            this.showMenu();
        }, 4000);
    }
    
    update(deltaTime) {
        if (this.state !== 'FIGHTING') return;
        
        // Update fighters
        this.fighters.forEach(fighter => {
            fighter.update(deltaTime, this.input);
        });
        
        // Apply physics
        this.physics.update(this.fighters, this.canvas.height, this.canvas.width);
        
        // Check for round end
        if (this.fighters[0].health <= 0 || this.fighters[1].health <= 0) {
            this.endRound('ko');
        }
        
        // Update UI
        this.updateHealthDisplay();
    }
    
    render() {
        // Clear canvas
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Render stage
        this.stage.render(this.ctx);
        
        // Render fighters
        if (this.state === 'FIGHTING' || this.state === 'ROUND_END' || this.state === 'FIGHT_END') {
            this.fighters.forEach(fighter => {
                this.renderer.renderFighter(fighter);
            });
        }
    }
    
    gameLoop(currentTime) {
        const deltaTime = (currentTime - this.lastTime) / 1000;
        this.lastTime = currentTime;
        
        this.update(deltaTime);
        this.render();
        
        requestAnimationFrame(this.gameLoop);
    }
}

// Start game when page loads
window.addEventListener('load', () => {
    new Game();
});
