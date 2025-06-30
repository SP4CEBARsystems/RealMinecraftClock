export default class ClockAnimator {
    /**
     * @param {() => void} onUpdate - Callback to call after each animation step
     */
    constructor(onUpdate) {
        this.currentDayCycle = 0;
        this.targetDayCycle = 0;
        this.animationVelocity = 0;
        this.animationDeltaTime = 1000 / 60;
        this.animationId = undefined;
        this.onUpdate = onUpdate;
    }

    setTargetDayCycle(target) {
        this.targetDayCycle = target;
        this.start();
    }

    /**
     * Starts the interval that runs the animation
     */
    start() {
        this.clear();
        this.animationId = setInterval(this.update.bind(this), this.animationDeltaTime);
    }
    
    /**
     * Clears the interval that runs the animation
     */
    clear() {
        // this.animationVelocity = 0;
        if (this.animationId !== undefined) {
            clearInterval(this.animationId);
            this.animationId = undefined;
        }
    }

    /**
     * Simulates a spring and calls the this.onUpdate callback method to render it
     */
    update() {
        // Interpolate between current and target day cycle
        // this.currentDayCycle = this.targetDayCycle;
        // this.currentDayCycle = this.lerp(this.currentDayCycle, this.targetDayCycle, 0.1);
        // this.animationVelocity = this.lerp(this.animationVelocity, this.targetDayCycle - this.currentDayCycle, 0.1);
        // const gain = 0.1;
        const stiffness = 0.99;
        const damping = 0.95;
        const displacement = this.targetDayCycle - this.currentDayCycle;
        if (Math.abs(displacement) < 0.01 && Math.abs(this.animationVelocity) <= 0.1) {
            this.animationVelocity = 0;
            return;
        }
        const force = displacement * stiffness;
        this.animationVelocity = (this.animationVelocity + force) * damping;
        // this.animationVelocity += Math.sign(displacement) * gain;
        this.currentDayCycle += this.animationVelocity * this.animationDeltaTime / 1000;
        if (this.onUpdate) this.onUpdate();
    }

    /**
     * Linear interpolation between two values
     * @param {number} a 
     * @param {number} b 
     * @param {number} t 
     * @returns {number}
     */
    lerp(a, b, t) {
        return a + (b - a) * t;
    }
}