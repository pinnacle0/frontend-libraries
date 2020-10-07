export class DistributionGenerator {
    // Reference: https://stackoverflow.com/questions/25582882/javascript-math-random-normal-distribution-gaussian-bell-curve
    static boxMullerTransform(min: number, max: number): number {
        let u = 0;
        let v = 0;
        while (u === 0) {
            u = Math.random();
        }
        while (v === 0) {
            v = Math.random();
        }
        let num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
        num = num / 10.0 + 0.5;
        if (num > 1 || num < 0) {
            num = DistributionGenerator.boxMullerTransform(min, max);
        }
        num *= max - min;
        num += min;
        return Math.round(num);
    }

    private readonly minValue: number;
    private readonly maxValue: number;
    private readonly minChange: number;
    private readonly maxChange: number;
    private currentValue: number;

    constructor(minValue: number, maxValue: number, minChange: number, maxChange: number) {
        this.minValue = minValue;
        this.maxValue = maxValue;
        this.minChange = minChange;
        this.maxChange = maxChange;
        this.currentValue = DistributionGenerator.boxMullerTransform(minValue, maxValue); // Randomly sample an initial value with normal distribution
    }

    next(): number {
        // Save currentValue for return
        const currentValue = this.currentValue;

        // Generator new value to replace currentValue
        const change = DistributionGenerator.boxMullerTransform(this.minChange, this.maxChange);
        // Tend to increase when below half of median value in the distribution, and vice versa
        const chanceOfDecrease = Math.max(0, (this.currentValue - this.minValue) / (this.maxValue - this.minValue));
        if (Math.random() > chanceOfDecrease) {
            this.currentValue += change;
            this.currentValue = Math.min(this.maxValue, this.currentValue);
        } else {
            this.currentValue -= change;
            this.currentValue = Math.max(this.minValue, this.currentValue);
        }

        return currentValue;
    }
}
