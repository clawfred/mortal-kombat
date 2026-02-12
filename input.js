// Input Manager - Handles keyboard and touch input for both players
export class InputManager {
    constructor() {
        this.keys = new Set();
        this.listeners = [];
        this.isMobile = this.detectMobile();
        this.touchActions = new Set();
        
        // Player 1 controls (keyboard)
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
        
        // Player 2 controls (keyboard)
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
        
        // Set up keyboard event listeners
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
        
        // Set up mobile controls if on mobile
        if (this.isMobile) {
            this.initMobileControls();
        }
    }
    
    detectMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
               (window.innerWidth <= 768);
    }
    
    initMobileControls() {
        const mobileControls = document.getElementById('mobile-controls');
        if (mobileControls) {
            mobileControls.classList.remove('hidden');
        }
        
        // Get all mobile buttons
        const buttons = document.querySelectorAll('.dpad-btn, .attack-btn');
        
        buttons.forEach(btn => {
            const action = btn.dataset.action;
            
            // Touch start
            btn.addEventListener('touchstart', (e) => {
                e.preventDefault();
                btn.classList.add('pressed');
                this.touchActions.add(action);
            }, { passive: false });
            
            // Touch end
            btn.addEventListener('touchend', (e) => {
                e.preventDefault();
                btn.classList.remove('pressed');
                this.touchActions.delete(action);
            }, { passive: false });
            
            // Touch cancel (finger moved off button)
            btn.addEventListener('touchcancel', (e) => {
                btn.classList.remove('pressed');
                this.touchActions.delete(action);
            });
            
            // Also support mouse for testing on desktop
            btn.addEventListener('mousedown', (e) => {
                e.preventDefault();
                btn.classList.add('pressed');
                this.touchActions.add(action);
            });
            
            btn.addEventListener('mouseup', (e) => {
                btn.classList.remove('pressed');
                this.touchActions.delete(action);
            });
            
            btn.addEventListener('mouseleave', (e) => {
                btn.classList.remove('pressed');
                this.touchActions.delete(action);
            });
        });
    }
    
    showMobileControls() {
        const mobileControls = document.getElementById('mobile-controls');
        if (mobileControls) {
            mobileControls.classList.remove('hidden');
        }
    }
    
    hideMobileControls() {
        const mobileControls = document.getElementById('mobile-controls');
        if (mobileControls) {
            mobileControls.classList.add('hidden');
        }
    }
    
    isGameKey(key) {
        const allControls = [...Object.values(this.p1Controls), ...Object.values(this.p2Controls)];
        return allControls.includes(key);
    }
    
    isPressed(key) {
        return this.keys.has(key);
    }
    
    // Check touch action
    isTouchPressed(action) {
        return this.touchActions.has(action);
    }
    
    // Check player-specific controls (keyboard or touch for P1)
    isPlayerPressed(player, action) {
        // Touch controls only affect Player 1
        if (player === 1 && this.isTouchPressed(action)) {
            return true;
        }
        
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
