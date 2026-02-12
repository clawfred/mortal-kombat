// Input Manager - Handles keyboard input for both players
export class InputManager {
    constructor() {
        this.keys = new Set();
        this.listeners = [];
        
        // Player 1 controls
        this.p1Controls = {
            left: 'ArrowLeft',
            right: 'ArrowRight',
            up: 'ArrowUp',
            down: 'ArrowDown',
            lightPunch: 'a',
            heavyPunch: 's',
            lightKick: 'd',
            heavyKick: 'f',
            block: ' ' // Space
        };
        
        // Player 2 controls
        this.p2Controls = {
            left: 'a',
            right: 'd',
            up: 'w',
            down: 's',
            lightPunch: 'j',
            heavyPunch: 'k',
            lightKick: 'l',
            heavyKick: ';',
            block: 'Shift'
        };
        
        // Set up event listeners
        window.addEventListener('keydown', (e) => {
            const key = e.key;
            
            // Prevent default for game keys
            if (this.isGameKey(key)) {
                e.preventDefault();
            }
            
            this.keys.add(key);
            this.emit('keydown', key);
        });
        
        window.addEventListener('keyup', (e) => {
            const key = e.key;
            this.keys.delete(key);
            this.emit('keyup', key);
        });
    }
    
    isGameKey(key) {
        const allControls = [...Object.values(this.p1Controls), ...Object.values(this.p2Controls)];
        return allControls.includes(key);
    }
    
    isPressed(key) {
        return this.keys.has(key);
    }
    
    // Check player-specific controls
    isPlayerPressed(player, action) {
        const controls = player === 1 ? this.p1Controls : this.p2Controls;
        return this.isPressed(controls[action]);
    }
    
    // Event system for menu interactions
    on(event, callback) {
        this.listeners.push({ event, callback });
    }
    
    emit(event, data) {
        this.listeners
            .filter(l => l.event === event)
            .forEach(l => l.callback(data));
    }
}
