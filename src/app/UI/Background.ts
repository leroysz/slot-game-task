import Loader = PIXI.Loader;
import TilingSprite = PIXI.TilingSprite;
import {Config} from "../config/Config";

export class Background {
    private readonly _container: PIXI.Container;

    constructor(private _stage: PIXI.Container, loader: Loader) {
        this._container = new PIXI.Container();
        this._stage.addChild(this._container);

        let background = new TilingSprite(loader.resources['spritesheet'].textures['Background.png'], Config.canvas_target_width, Config.canvas_target_height);
        this._container.addChild(background);
    }
}
