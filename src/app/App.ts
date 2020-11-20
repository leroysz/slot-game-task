import * as PIXI from 'pixi.js';
import {Config} from './config/Config'
import {ResourceLoader} from "./util/ResourceLoader";
import {ProgressBar} from "./UI/ProgressBar";
import Loader = PIXI.Loader;
import ICallbackID = PIXI.Loader.ICallbackID;
import {SlotMachineComponent} from "./components/SlotMachineComponent";

export class App {

    _app: PIXI.Application;
    _progressBar: ProgressBar;


    constructor() {
        this.init();
    }

    init() {
        this._app = new PIXI.Application({
            width: Config.canvas_target_width,
            height: Config.canvas_target_height,
            antialias: true,
            transparent: false,
            resolution: 1,
            backgroundColor: 0x333333
        });
        document.body.appendChild(this._app.view);


        this.createProgressBar();
        new ResourceLoader(this._app.loader, this.onProgress.bind(this), this.onLoadFinish.bind(this));
    }

    onProgress = (loader: Loader) => {
        this._progressBar.draw(loader.progress);
    };

    addContainerToStage = (container: PIXI.Container) => {
        this._app.stage.addChild(container);
    };

    createProgressBar = () => {
        this._progressBar = new ProgressBar(this._app.view.width, this._app.view.height);
        this.addContainerToStage(this._progressBar.container);
    };

    deleteProgressBar = () => {
        this._progressBar.clear();
        this._progressBar.destory();
    };

    onLoadFinish = (cb_id: ICallbackID) => {
        this._app.loader.onProgress.detach(cb_id);

        setTimeout(() => {
            this.deleteProgressBar();
            new SlotMachineComponent(this._app);
        }, 1000);

    };


}
