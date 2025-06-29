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

    start() {
        this.clear();
        this.animationId = setInterval(this.update.bind(this), this.animationDeltaTime);
    }

    clear() {
        if (this.animationId !== undefined) {
            clearInterval(this.animationId);
            this.animationId = undefined;
        }
    }

    update() {
        const stiffness = 0.99;
        const damping = 0.95;
        const displacement = this.targetDayCycle - this.currentDayCycle;
        if (Math.abs(displacement) < 0.01 && Math.abs(this.animationVelocity) <= 0.1) {
            this.animationVelocity = 0;
            return;
        }
        const force = displacement * stiffness;
        this.animationVelocity = (this.animationVelocity + force) * damping;
        this.currentDayCycle += this.animationVelocity * this.animationDeltaTime / 1000;
        if (this.onUpdate) this.onUpdate();
    }
}