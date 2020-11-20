import Sprite = PIXI.Sprite;
import Graphics = PIXI.Graphics;
import Container = PIXI.Container;

export class PixiUtil {

    public static scaleSpriteProportionallyByWidth(sprite: Sprite, newWidth: number) {
        let ratio = newWidth / sprite.width;
        sprite.width = sprite.width * ratio;
        sprite.height = sprite.height * ratio;
    }

    static createBackground(container: Container, width: number, height: number, xPos: number, yPos: number, color = 0xffffff) {
        const background = new Graphics();
        background.beginFill(color);
        background.drawRect(xPos, yPos, width, height);
        container.addChild(background);
    }
}
