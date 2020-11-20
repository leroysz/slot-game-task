import Graphics = PIXI.Graphics;
import {Config} from '../config/Config';


export class ProgressBar {

    private readonly _container: PIXI.Container;
    private readonly _progressBar: PIXI.Graphics;
    private readonly _progress_bar_width = 340;
    private readonly _progress_bar_height = 10;

    constructor(private _canvasWidth: number, private _canvasHeight: number
                // private _stage: PIXI.Container,
                // private _view: HTMLCanvasElement
    ) {

        this._container = new PIXI.Container();

        this._progressBar = new Graphics();
        this._container.addChild(this._progressBar);
    }

    get container(): PIXI.Container {
        return this._container;
    }

    draw(percentVal: number) {
        this._progressBar.clear();
        this._progressBar.beginFill(Config.progress_bar_bg_color);
        this._progressBar.drawRect(
            (this._canvasWidth - this._progress_bar_width) / 2,
            (this._canvasHeight - this._progress_bar_height) / 2,
            this._progress_bar_width,
            this._progress_bar_height
        );
        this._progressBar.beginFill(Config.progress_bar_fill_color);
        this._progressBar.drawRect(
            (this._canvasWidth - this._progress_bar_width) / 2,
            (this._canvasHeight - this._progress_bar_height) / 2,
            this._progress_bar_width * percentVal / 100,
            this._progress_bar_height
        );
        this._progressBar.endFill();
    }

    clear() {
        if (this._progressBar)
            this._progressBar.clear();
    }

    destory() {
        this._container.destroy();
    }


}
