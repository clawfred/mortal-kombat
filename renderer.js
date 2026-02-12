// Renderer - Handles all canvas drawing
export class Renderer {
    constructor(ctx, width, height) {
        this.ctx = ctx;
        this.width = width;
        this.height = height;
    }
    
    renderFighter(fighter) {
        const ctx = this.ctx;
        
        ctx.save();
        
        // Flash white when hit
        if (fighter.hitFlash && fighter.hitFlash > 0) {
            ctx.globalAlpha = 0.7;
            fighter.hitFlash -= 0.016; // Approx 1 frame at 60fps
        }
        
        // Flip sprite if facing left
        if (!fighter.facingRight) {
            ctx.translate(fighter.x + fighter.width, fighter.y);
            ctx.scale(-1, 1);
        } else {
            ctx.translate(fighter.x, fighter.y);
        }
        
        // Draw based on state
        switch (fighter.state) {
            case 'idle':
                this.drawIdleAnimation(ctx, fighter);
                break;
            case 'walking':
                this.drawWalkAnimation(ctx, fighter);
                break;
            case 'jumping':
                this.drawJumpAnimation(ctx, fighter);
                break;
            case 'crouching':
                this.drawCrouchAnimation(ctx, fighter);
                break;
            case 'attacking':
                this.drawAttackAnimation(ctx, fighter);
                break;
            case 'blocking':
                this.drawBlockAnimation(ctx, fighter);
                break;
            case 'hit':
                this.drawHitAnimation(ctx, fighter);
                break;
            case 'defeated':
                this.drawDefeatedAnimation(ctx, fighter);
                break;
            default:
                this.drawIdleAnimation(ctx, fighter);
        }
        
        ctx.restore();
        
        // Debug: Draw hitboxes (comment out for production)
        // this.drawHitboxes(fighter);
    }
    
    drawIdleAnimation(ctx, fighter) {
        // Simple standing pose with breathing animation
        const breathe = Math.sin(fighter.animationFrame * 0.5) * 2;
        
        // Body
        ctx.fillStyle = fighter.color;
        ctx.fillRect(15, 30 + breathe, 30, 60);
        
        // Head
        ctx.fillStyle = fighter.secondaryColor;
        ctx.fillRect(18, 15 + breathe, 24, 20);
        
        // Arms
        ctx.fillStyle = fighter.color;
        ctx.fillRect(10, 40 + breathe, 8, 30);
        ctx.fillRect(42, 40 + breathe, 8, 30);
        
        // Legs
        ctx.fillRect(18, 90, 10, 30);
        ctx.fillRect(32, 90, 10, 30);
    }
    
    drawWalkAnimation(ctx, fighter) {
        const walkCycle = Math.floor(fighter.animationFrame / 3) % 4;
        const legOffset = walkCycle < 2 ? walkCycle * 4 : (4 - walkCycle) * 4;
        
        // Body
        ctx.fillStyle = fighter.color;
        ctx.fillRect(15, 30, 30, 60);
        
        // Head (bobs slightly)
        const bob = Math.sin(walkCycle * Math.PI / 2) * 2;
        ctx.fillStyle = fighter.secondaryColor;
        ctx.fillRect(18, 15 + bob, 24, 20);
        
        // Arms (swing)
        ctx.fillStyle = fighter.color;
        ctx.fillRect(10, 40 - legOffset, 8, 30);
        ctx.fillRect(42, 40 + legOffset, 8, 30);
        
        // Legs (alternate)
        ctx.fillRect(18, 90, 10, 30 - legOffset);
        ctx.fillRect(32, 90, 10, 30 + legOffset);
    }
    
    drawJumpAnimation(ctx, fighter) {
        // Airborne pose
        ctx.fillStyle = fighter.color;
        ctx.fillRect(15, 35, 30, 55);
        
        // Head
        ctx.fillStyle = fighter.secondaryColor;
        ctx.fillRect(18, 20, 24, 20);
        
        // Arms up
        ctx.fillStyle = fighter.color;
        ctx.fillRect(8, 25, 8, 25);
        ctx.fillRect(44, 25, 8, 25);
        
        // Legs bent
        ctx.fillRect(18, 85, 10, 20);
        ctx.fillRect(32, 85, 10, 20);
    }
    
    drawCrouchAnimation(ctx, fighter) {
        // Crouching pose
        ctx.fillStyle = fighter.color;
        ctx.fillRect(15, 60, 30, 30);
        
        // Head lower
        ctx.fillStyle = fighter.secondaryColor;
        ctx.fillRect(18, 45, 24, 20);
        
        // Arms
        ctx.fillStyle = fighter.color;
        ctx.fillRect(10, 65, 8, 20);
        ctx.fillRect(42, 65, 8, 20);
        
        // Legs bent
        ctx.fillRect(18, 85, 10, 35);
        ctx.fillRect(32, 85, 10, 35);
    }
    
    drawAttackAnimation(ctx, fighter) {
        const isPunch = fighter.currentAttack && fighter.currentAttack.type.includes('Punch');
        const isHeavy = fighter.currentAttack && fighter.currentAttack.type.includes('heavy');
        
        // Body - lean forward
        ctx.fillStyle = fighter.color;
        ctx.fillRect(isPunch ? 12 : 15, 30, 30, 60);
        
        // Head
        ctx.fillStyle = fighter.secondaryColor;
        ctx.fillRect(isPunch ? 15 : 18, 15, 24, 20);
        
        if (isPunch) {
            // Punching - extend arm
            ctx.fillStyle = fighter.color;
            ctx.fillRect(42, 35, isHeavy ? 25 : 20, 12); // Extended arm
            ctx.fillRect(10, 45, 8, 25); // Other arm
        } else {
            // Kicking - extend leg
            ctx.fillStyle = fighter.color;
            ctx.fillRect(10, 40, 8, 30); // Arms
            ctx.fillRect(42, 40, 8, 30);
            ctx.fillRect(38, isHeavy ? 85 : 90, isHeavy ? 30 : 25, 12); // Extended leg
            ctx.fillRect(18, 90, 10, 30); // Other leg
        }
        
        // Draw attack trail effect
        if (fighter.attackFrame < 5) {
            ctx.globalAlpha = 0.3;
            ctx.fillStyle = '#FFD700';
            if (isPunch) {
                ctx.fillRect(60, 30, 15, 15);
            } else {
                ctx.fillRect(60, 85, 15, 15);
            }
            ctx.globalAlpha = 1;
        }
    }
    
    drawBlockAnimation(ctx, fighter) {
        // Defensive pose
        ctx.fillStyle = fighter.color;
        ctx.fillRect(15, 30, 30, 60);
        
        // Head tucked
        ctx.fillStyle = fighter.secondaryColor;
        ctx.fillRect(18, 18, 24, 20);
        
        // Arms up defensively
        ctx.fillStyle = fighter.color;
        ctx.fillRect(8, 25, 8, 30);
        ctx.fillRect(44, 25, 8, 30);
        
        // Legs
        ctx.fillRect(18, 90, 10, 30);
        ctx.fillRect(32, 90, 10, 30);
        
        // Block effect
        ctx.globalAlpha = 0.5;
        ctx.fillStyle = '#FFD700';
        ctx.fillRect(0, 20, 5, 80);
        ctx.globalAlpha = 1;
    }
    
    drawHitAnimation(ctx, fighter) {
        // Recoiling from hit
        ctx.fillStyle = fighter.color;
        ctx.fillRect(18, 35, 30, 55);
        
        // Head back
        ctx.fillStyle = fighter.secondaryColor;
        ctx.fillRect(21, 20, 24, 20);
        
        // Arms
        ctx.fillStyle = fighter.color;
        ctx.fillRect(12, 45, 8, 25);
        ctx.fillRect(40, 45, 8, 25);
        
        // Legs
        ctx.fillRect(21, 90, 10, 30);
        ctx.fillRect(35, 90, 10, 30);
        
        // Impact effect
        ctx.globalAlpha = 0.6;
        ctx.fillStyle = '#FF0000';
        ctx.fillRect(0, 30, 10, 40);
        ctx.globalAlpha = 1;
    }
    
    drawDefeatedAnimation(ctx, fighter) {
        // Knocked down
        ctx.fillStyle = fighter.color;
        ctx.fillRect(10, 80, 40, 25);
        
        // Head
        ctx.fillStyle = fighter.secondaryColor;
        ctx.fillRect(5, 85, 20, 15);
        
        // Arms sprawled
        ctx.fillRect(8, 75, 20, 8);
        ctx.fillRect(32, 90, 20, 8);
        
        // Legs
        ctx.fillRect(15, 100, 12, 8);
        ctx.fillRect(35, 105, 12, 8);
    }
    
    drawHitboxes(fighter) {
        const ctx = this.ctx;
        
        // Draw hurtbox (blue)
        const hurtbox = fighter.getHurtbox();
        ctx.strokeStyle = '#00F';
        ctx.lineWidth = 2;
        ctx.strokeRect(hurtbox.x, hurtbox.y, hurtbox.width, hurtbox.height);
        
        // Draw hitboxes (red)
        const hitboxes = fighter.getHitboxes();
        hitboxes.forEach(hitbox => {
            ctx.strokeStyle = hitbox.active ? '#F00' : '#666';
            ctx.lineWidth = 2;
            ctx.strokeRect(hitbox.x, hitbox.y, hitbox.width, hitbox.height);
        });
    }
}
