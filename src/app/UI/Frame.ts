import Loader = PIXI.Loader;
import Sprite = PIXI.Sprite;
import * as PIXI from "pixi.js";

export class Frame {
    private readonly _container: PIXI.Container;
    private readonly _frameWidth: number;

    constructor(loader: Loader, private _canvasWidth: number, private _canvasHeight: number,private _app:PIXI.Application) {
        this._container = new PIXI.Container();

        let frame = new Sprite(loader.resources['spritesheet'].textures['Frame.png']);
        this._frameWidth = frame.width;

        this._container.addChild(frame);

        this.container.position.x = (this._app.stage.width / 2) - (this.container.width / 2);
        this.container.position.y = (this._app.stage.height / 2) - (this.container.height / 2);
    }

    get container(): PIXI.Container {
        return this._container;
    }

    get frameWidth(): number {
        return this._frameWidth;
    }
}
