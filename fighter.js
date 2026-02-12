// Fighter class - Represents a playable character
export class Fighter {
    constructor(character, x, y, facingRight, playerNumber) {
        this.character = character;
        this.x = x;
        this.y = y;
        this.playerNumber = playerNumber;
        
        // Physics
        this.velocityX = 0;
        this.velocityY = 0;
        this.facingRight = facingRight;
        this.onGround = false;
        
        // Stats
        this.maxHealth = 100;
        this.health = 100;
        this.speed = 200;
        this.jumpPower = -500;
        
        // Combat state
        this.state = 'idle'; // idle, walking, jumping, attacking, blocking, hit, defeated
        this.currentAttack = null;
        this.attackFrame = 0;
        this.hitstunTimer = 0;
        this.blockstunTimer = 0;
        
        // Hitbox and hurtbox
        this.width = 60;
        this.height = 120;
        this.hitboxes = [];
        this.hurtbox = { x: 0, y: 0, width: this.width, height: this.height };
        
        // Animation
        this.animationFrame = 0;
        this.animationTimer = 0;
        this.animationSpeed = 0.1; // seconds per frame
        
        // Character-specific data
        this.initCharacter(character);
    }
    
    initCharacter(character) {
        if (character === 'scorpion') {
            this.color = '#FFA500';
            this.secondaryColor = '#FF4500';
            this.moves = {
                lightPunch: { damage: 5, hitstun: 0.2, frames: 8, recovery: 5 },
                heavyPunch: { damage: 12, hitstun: 0.4, frames: 15, recovery: 12 },
                lightKick: { damage: 7, hitstun: 0.25, frames: 10, recovery: 7 },
                heavyKick: { damage: 15, hitstun: 0.5, frames: 20, recovery: 15 }
            };
        } else if (character === 'subzero') {
            this.color = '#4169E1';
            this.secondaryColor = '#87CEEB';
            this.moves = {
                lightPunch: { damage: 5, hitstun: 0.2, frames: 8, recovery: 5 },
                heavyPunch: { damage: 12, hitstun: 0.4, frames: 15, recovery: 12 },
                lightKick: { damage: 7, hitstun: 0.25, frames: 10, recovery: 7 },
                heavyKick: { damage: 15, hitstun: 0.5, frames: 20, recovery: 15 }
            };
        }
    }
    
    update(deltaTime, input) {
        // Update timers
        if (this.hitstunTimer > 0) {
            this.hitstunTimer -= deltaTime;
            this.state = 'hit';
            return;
        }
        
        if (this.blockstunTimer > 0) {
            this.blockstunTimer -= deltaTime;
            this.state = 'blocking';
            return;
        }
        
        // Update animation
        this.animationTimer += deltaTime;
        if (this.animationTimer >= this.animationSpeed) {
            this.animationTimer = 0;
            this.animationFrame++;
        }
        
        // Handle input
        this.handleInput(input, deltaTime);
        
        // Update attack state
        if (this.currentAttack) {
            this.updateAttack(deltaTime);
        }
    }
    
    handleInput(input, deltaTime) {
        const p = this.playerNumber;
        
        // Can't act during attack recovery
        if (this.currentAttack && this.attackFrame < this.currentAttack.frames) {
            return;
        }
        
        // Blocking
        if (input.isPlayerPressed(p, 'block')) {
            this.state = 'blocking';
            this.velocityX = 0;
            return;
        }
        
        // Attacks
        if (input.isPlayerPressed(p, 'lightPunch') && this.onGround && !this.currentAttack) {
            this.startAttack('lightPunch');
            return;
        }
        if (input.isPlayerPressed(p, 'heavyPunch') && this.onGround && !this.currentAttack) {
            this.startAttack('heavyPunch');
            return;
        }
        if (input.isPlayerPressed(p, 'lightKick') && this.onGround && !this.currentAttack) {
            this.startAttack('lightKick');
            return;
        }
        if (input.isPlayerPressed(p, 'heavyKick') && this.onGround && !this.currentAttack) {
            this.startAttack('heavyKick');
            return;
        }
        
        // Movement
        let moving = false;
        
        if (input.isPlayerPressed(p, 'left')) {
            this.velocityX = -this.speed;
            this.facingRight = false;
            moving = true;
        } else if (input.isPlayerPressed(p, 'right')) {
            this.velocityX = this.speed;
            this.facingRight = true;
            moving = true;
        } else {
            this.velocityX = 0;
        }
        
        // Jumping
        if (input.isPlayerPressed(p, 'up') && this.onGround) {
            this.velocityY = this.jumpPower;
            this.state = 'jumping';
        }
        
        // Crouching
        if (input.isPlayerPressed(p, 'down') && this.onGround) {
            this.state = 'crouching';
            this.velocityX = 0;
        } else if (!this.currentAttack) {
            // Set state based on movement
            if (!this.onGround) {
                this.state = 'jumping';
            } else if (moving) {
                this.state = 'walking';
            } else {
                this.state = 'idle';
            }
        }
    }
    
    startAttack(attackType) {
        this.currentAttack = this.moves[attackType];
        this.currentAttack.type = attackType;
        this.attackFrame = 0;
        this.state = 'attacking';
        this.animationFrame = 0;
        
        // Create hitbox
        const hitboxWidth = 40;
        const hitboxHeight = 30;
        const hitboxX = this.facingRight ? this.width : -hitboxWidth;
        const hitboxY = attackType.includes('Kick') ? 60 : 30;
        
        this.hitboxes = [{
            x: hitboxX,
            y: hitboxY,
            width: hitboxWidth,
            height: hitboxHeight,
            active: true
        }];
    }
    
    updateAttack(deltaTime) {
        this.attackFrame++;
        
        // Deactivate hitbox after active frames (first 40% of attack)
        const activeFrames = Math.floor(this.currentAttack.frames * 0.4);
        if (this.attackFrame > activeFrames) {
            this.hitboxes.forEach(box => box.active = false);
        }
        
        // End attack after total frames
        if (this.attackFrame >= this.currentAttack.frames + this.currentAttack.recovery) {
            this.currentAttack = null;
            this.hitboxes = [];
            this.state = 'idle';
        }
    }
    
    takeDamage(damage, hitstun, isBlocked = false) {
        if (isBlocked) {
            // Reduced damage when blocking
            damage *= 0.3;
            this.blockstunTimer = hitstun * 0.5;
        } else {
            this.hitstunTimer = hitstun;
            
            // Knockback
            const knockbackDirection = this.facingRight ? -1 : 1;
            this.velocityX = knockbackDirection * 150;
        }
        
        this.health = Math.max(0, this.health - damage);
        
        if (this.health <= 0) {
            this.state = 'defeated';
        }
    }
    
    getHurtbox() {
        return {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height
        };
    }
    
    getHitboxes() {
        return this.hitboxes.map(box => ({
            x: this.x + box.x,
            y: this.y + box.y,
            width: box.width,
            height: box.height,
            active: box.active,
            damage: this.currentAttack.damage,
            hitstun: this.currentAttack.hitstun
        }));
    }
    
    reset(x, y) {
        this.x = x;
        this.y = y;
        this.velocityX = 0;
        this.velocityY = 0;
        this.health = this.maxHealth;
        this.state = 'idle';
        this.currentAttack = null;
        this.hitstunTimer = 0;
        this.blockstunTimer = 0;
        this.hitboxes = [];
    }
}
