import Loader = PIXI.Loader;
import ICallbackID = PIXI.Loader.ICallbackID;


export class ResourceLoader {

    private readonly _spritesheet_path = '/img/spritesheet.json';

    constructor(private _loader: PIXI.Loader, private _onProgress: (loader: Loader) => void, private _onComplete: (cb_id: ICallbackID) => void) {

        this.initResourceLoader();
    }

    initResourceLoader() {
        this._loader.add('spritesheet', this._spritesheet_path);

        let cb_id: ICallbackID = this._loader.onProgress.add(this._onProgress);
        this._loader.onComplete.add(() => {
            this._onComplete(cb_id);
        });

        this._loader.load();
    }
}
