// Cursor trail effect
class CursorTrail {
    constructor() {
        this.points = [];
        this.maxPoints = 25;
        this.canvas = null;
        this.ctx = null;
        this.mouse = { x: 0, y: 0 };
        this.lastMouse = { x: 0, y: 0 };
        this.init();
    }

    init() {
        // Create canvas for trail
        this.canvas = document.createElement('canvas');
        this.canvas.style.position = 'fixed';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.pointerEvents = 'none';
        this.canvas.style.zIndex = '9999';
        this.canvas.style.mixBlendMode = 'screen';
        document.body.appendChild(this.canvas);

        this.ctx = this.canvas.getContext('2d');
        this.resize();

        // Event listeners
        window.addEventListener('resize', () => this.resize());
        document.addEventListener('mousemove', (e) => this.updateMouse(e));
        
        // Start animation
        this.animate();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    updateMouse(e) {
        this.lastMouse.x = this.mouse.x;
        this.lastMouse.y = this.mouse.y;
        this.mouse.x = e.clientX;
        this.mouse.y = e.clientY;

        // Calculate movement distance
        const distance = Math.sqrt(
            Math.pow(this.mouse.x - this.lastMouse.x, 2) + 
            Math.pow(this.mouse.y - this.lastMouse.y, 2)
        );

        // Only add point if mouse moved enough (reduces jitter)
        if (distance > 3) {
            this.points.push({
                x: this.mouse.x,
                y: this.mouse.y,
                age: 0,
                speed: Math.min(distance / 10, 1) // Track movement speed
            });

            // Remove old points
            if (this.points.length > this.maxPoints) {
                this.points.shift();
            }
        }
    }

    animate() {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Update and draw trail
        if (this.points.length > 1) {
            this.drawTrail();
        }

        // Age points (slower aging for longer trail)
        this.points.forEach(point => {
            point.age += 0.03;
        });

        // Remove very old points
        this.points = this.points.filter(point => point.age < 1);

        requestAnimationFrame(() => this.animate());
    }

    drawTrail() {
        this.ctx.save();
        
        if (this.points.length < 2) return;

        // Draw multiple trail segments with varying opacity and thickness
        for (let layer = 0; layer < 3; layer++) {
            this.ctx.beginPath();
            
            // Different line widths for layers
            const baseWidth = [4, 2, 1][layer];
            const baseAlpha = [0.4, 0.6, 0.8][layer];
            
            // Move to first point
            this.ctx.moveTo(this.points[0].x, this.points[0].y);

            // Create smooth curve using bezier curves
            for (let i = 1; i < this.points.length - 1; i++) {
                const currentPoint = this.points[i];
                const nextPoint = this.points[i + 1];
                const prevPoint = this.points[i - 1];
                
                // Calculate smooth control points
                const cp1X = prevPoint.x + (currentPoint.x - prevPoint.x) * 0.5;
                const cp1Y = prevPoint.y + (currentPoint.y - prevPoint.y) * 0.5;
                const cp2X = currentPoint.x + (nextPoint.x - currentPoint.x) * 0.5;
                const cp2Y = currentPoint.y + (nextPoint.y - currentPoint.y) * 0.5;
                
                // Calculate fade based on age and distance from current mouse
                const distanceFromMouse = Math.sqrt(
                    Math.pow(currentPoint.x - this.mouse.x, 2) + 
                    Math.pow(currentPoint.y - this.mouse.y, 2)
                );
                const distanceFade = Math.max(0, 1 - distanceFromMouse / 200);
                const ageFade = Math.max(0, 1 - currentPoint.age);
                const totalFade = distanceFade * ageFade * baseAlpha;
                
                // Set line style for this segment
                this.ctx.lineWidth = baseWidth * (1 - currentPoint.age * 0.5);
                this.ctx.strokeStyle = `rgba(255, 255, 255, ${totalFade})`;
                this.ctx.lineCap = 'round';
                this.ctx.lineJoin = 'round';
                
                // Draw bezier curve to next point
                this.ctx.bezierCurveTo(cp1X, cp1Y, cp2X, cp2Y, nextPoint.x, nextPoint.y);
            }

            this.ctx.stroke();
        }
        
        this.ctx.restore();
    }
}

// Custom cursor dot functionality
class CustomCursor {
    constructor() {
        this.mouse = { x: 0, y: 0 };
        this.init();
    }

    init() {
        document.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
            
            // Update cursor dot position using CSS custom properties
            document.documentElement.style.setProperty('--mouse-x', this.mouse.x + 'px');
            document.documentElement.style.setProperty('--mouse-y', this.mouse.y + 'px');
            
            // Update body::after position
            const bodyAfter = document.body;
            if (bodyAfter) {
                bodyAfter.style.setProperty('--cursor-x', this.mouse.x + 'px');
                bodyAfter.style.setProperty('--cursor-y', this.mouse.y + 'px');
            }
        });
    }
}

// Initialize cursor trail when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Only initialize on desktop devices
    if (window.innerWidth > 768) {
        new CursorTrail();
        new CustomCursor();
        
        // Update cursor dot position with CSS variables
        const style = document.createElement('style');
        style.textContent = `
            body::after {
                left: var(--cursor-x, 0);
                top: var(--cursor-y, 0);
            }
        `;
        document.head.appendChild(style);
    }
});