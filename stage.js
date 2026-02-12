// Stage - Renders the fighting arena background
export class Stage {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.updateGroundY();
    }
    
    updateGroundY() {
        const isMobile = window.innerWidth <= 768;
        this.groundY = this.height - (isMobile ? 120 : 220);
    }
    
    render(ctx) {
        // Sky gradient
        const skyGradient = ctx.createLinearGradient(0, 0, 0, this.groundY);
        skyGradient.addColorStop(0, '#1a0033');
        skyGradient.addColorStop(0.5, '#2d004d');
        skyGradient.addColorStop(1, '#4d0066');
        
        ctx.fillStyle = skyGradient;
        ctx.fillRect(0, 0, this.width, this.groundY);
        
        // Mountains in background
        this.drawMountains(ctx);
        
        // Ground
        const groundGradient = ctx.createLinearGradient(0, this.groundY, 0, this.height);
        groundGradient.addColorStop(0, '#4a2511');
        groundGradient.addColorStop(0.3, '#3a1f0f');
        groundGradient.addColorStop(1, '#2a150a');
        
        ctx.fillStyle = groundGradient;
        ctx.fillRect(0, this.groundY, this.width, this.height - this.groundY);
        
        // Ground details
        this.drawGroundDetails(ctx);
        
        // Arena boundary lines
        ctx.strokeStyle = '#FFD700';
        ctx.lineWidth = 3;
        ctx.shadowColor = '#FFD700';
        ctx.shadowBlur = 5;
        
        // Left boundary
        ctx.beginPath();
        ctx.moveTo(50, this.groundY - 150);
        ctx.lineTo(50, this.groundY);
        ctx.stroke();
        
        // Right boundary
        ctx.beginPath();
        ctx.moveTo(this.width - 50, this.groundY - 150);
        ctx.lineTo(this.width - 50, this.groundY);
        ctx.stroke();
        
        ctx.shadowBlur = 0;
    }
    
    drawMountains(ctx) {
        // Background mountains
        ctx.fillStyle = 'rgba(100, 0, 150, 0.3)';
        
        // Mountain 1
        ctx.beginPath();
        ctx.moveTo(0, this.groundY);
        ctx.lineTo(200, 250);
        ctx.lineTo(400, this.groundY);
        ctx.fill();
        
        // Mountain 2
        ctx.beginPath();
        ctx.moveTo(300, this.groundY);
        ctx.lineTo(500, 200);
        ctx.lineTo(700, this.groundY);
        ctx.fill();
        
        // Mountain 3
        ctx.beginPath();
        ctx.moveTo(600, this.groundY);
        ctx.lineTo(800, 180);
        ctx.lineTo(1000, this.groundY);
        ctx.fill();
        
        // Mountain 4
        ctx.beginPath();
        ctx.moveTo(900, this.groundY);
        ctx.lineTo(1100, 220);
        ctx.lineTo(1280, this.groundY);
        ctx.fill();
    }
    
    drawGroundDetails(ctx) {
        // Floor pattern
        ctx.strokeStyle = 'rgba(255, 215, 0, 0.2)';
        ctx.lineWidth = 2;
        
        // Vertical lines
        for (let x = 100; x < this.width; x += 100) {
            ctx.beginPath();
            ctx.moveTo(x, this.groundY);
            ctx.lineTo(x, this.height);
            ctx.stroke();
        }
        
        // Horizontal lines
        for (let y = this.groundY + 50; y < this.height; y += 50) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(this.width, y);
            ctx.stroke();
        }
        
        // Shadow under fighters
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.ellipse(this.width * 0.3, this.groundY + 10, 60, 15, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.ellipse(this.width * 0.7, this.groundY + 10, 60, 15, 0, 0, Math.PI * 2);
        ctx.fill();
    }
}
