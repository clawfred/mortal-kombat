// Physics system - Handles gravity, collisions, and hit detection
export class Physics {
    constructor() {
        this.gravity = 1200; // pixels per second^2
        this.groundY = 500; // Ground level
    }
    
    update(fighters, canvasHeight, canvasWidth = 1280) {
        const isMobile = window.innerWidth <= 768;
        this.groundY = canvasHeight - (isMobile ? 120 : 220); // Set ground based on canvas and device
        
        // Apply gravity and movement to each fighter
        fighters.forEach(fighter => {
            this.applyGravity(fighter);
            this.applyMovement(fighter);
            this.checkGround(fighter);
        });
        
        // Check for hits between fighters
        if (fighters.length >= 2) {
            this.checkCombat(fighters[0], fighters[1]);
        }
        
        // Keep fighters in bounds
        fighters.forEach(fighter => {
            this.keepInBounds(fighter, canvasWidth);
        });
        
        // Keep fighters from overlapping
        if (fighters.length >= 2) {
            this.preventOverlap(fighters[0], fighters[1]);
        }
    }
    
    applyGravity(fighter) {
        if (!fighter.onGround) {
            fighter.velocityY += this.gravity * (1/60); // Assuming 60fps
        }
    }
    
    applyMovement(fighter) {
        fighter.x += fighter.velocityX * (1/60);
        fighter.y += fighter.velocityY * (1/60);
    }
    
    checkGround(fighter) {
        if (fighter.y + fighter.height >= this.groundY) {
            fighter.y = this.groundY - fighter.height;
            fighter.velocityY = 0;
            fighter.onGround = true;
        } else {
            fighter.onGround = false;
        }
    }
    
    keepInBounds(fighter, canvasWidth = 1280) {
        const minX = 20;
        const maxX = canvasWidth - fighter.width - 20;
        
        if (fighter.x < minX) {
            fighter.x = minX;
            fighter.velocityX = 0;
        }
        if (fighter.x > maxX) {
            fighter.x = maxX;
            fighter.velocityX = 0;
        }
    }
    
    preventOverlap(fighter1, fighter2) {
        const box1 = fighter1.getHurtbox();
        const box2 = fighter2.getHurtbox();
        
        if (this.boxesOverlap(box1, box2)) {
            // Push fighters apart
            const overlap = (box1.x + box1.width) - box2.x;
            const pushDistance = overlap / 2;
            
            if (fighter1.x < fighter2.x) {
                fighter1.x -= pushDistance;
                fighter2.x += pushDistance;
            } else {
                fighter1.x += pushDistance;
                fighter2.x -= pushDistance;
            }
            
            // Stop horizontal movement during overlap
            fighter1.velocityX = 0;
            fighter2.velocityX = 0;
        }
    }
    
    checkCombat(fighter1, fighter2) {
        // Check if fighter1's attacks hit fighter2
        this.checkHit(fighter1, fighter2);
        // Check if fighter2's attacks hit fighter1
        this.checkHit(fighter2, fighter1);
    }
    
    checkHit(attacker, defender) {
        // Skip if attacker has no active hitboxes
        if (!attacker.currentAttack) return;
        
        const hitboxes = attacker.getHitboxes();
        const hurtbox = defender.getHurtbox();
        
        hitboxes.forEach(hitbox => {
            if (!hitbox.active) return;
            
            if (this.boxesOverlap(hitbox, hurtbox)) {
                // Hit landed!
                const isBlocked = defender.state === 'blocking' && this.isFacingAttacker(defender, attacker);
                
                defender.takeDamage(hitbox.damage, hitbox.hitstun, isBlocked);
                
                // Deactivate hitbox so it doesn't hit multiple times
                hitbox.active = false;
                
                // Flash effect (could be handled by renderer)
                defender.hitFlash = 0.1;
            }
        });
    }
    
    isFacingAttacker(defender, attacker) {
        if (defender.x < attacker.x) {
            return defender.facingRight; // Defender is on left, should face right
        } else {
            return !defender.facingRight; // Defender is on right, should face left
        }
    }
    
    boxesOverlap(box1, box2) {
        return box1.x < box2.x + box2.width &&
               box1.x + box1.width > box2.x &&
               box1.y < box2.y + box2.height &&
               box1.y + box1.height > box2.y;
    }
}
