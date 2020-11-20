export class MathUtil {
    static getRandomInt(min: number, max: number) {
        return Math.floor(Math.random() * (max - min) + min);
    }
}
