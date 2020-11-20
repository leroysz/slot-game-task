import * as PIXI from "pixi.js";
import Loader = PIXI.Loader;
import Sprite = PIXI.Sprite;

export class SpinBtn {

    private _btn_idle: PIXI.Texture;
    private _btn_hover: PIXI.Texture;
    private _btn_disabled: PIXI.Texture;
    private _btn: PIXI.Sprite;
    private _isIdle: boolean;

    private _container =new PIXI.Container();

    constructor(private _loader: Loader, private _onSpinBtnClick: () => void, frameX: number, frameY: number, frameWidth: number, frameHeight: number) {
        this.init();

        this._container.x = frameX + (frameWidth / 2) - (this._btn.width / 2);
        this._container.y = frameY + frameHeight;
        this._container.addChild(this._btn);

    }

    init() {
        this._btn_idle = this._loader.resources['spritesheet'].textures['Btn_idle.png'];
        this._btn_hover = this._loader.resources['spritesheet'].textures['Btn_hover.png'];
        this._btn_disabled = this._loader.resources['spritesheet'].textures['Btn_disabled.png'];
        this._btn = new Sprite(this._btn_idle);
        this._btn.buttonMode = true;
        this._btn.interactive = true;
        this._isIdle = true;

        this._btn.addListener('pointerover', this.onHover);
        this._btn.addListener('pointerout', this.onOut);
        this._btn.addListener('pointertap', this.onClick);
    }

    onClick = () => {
        if (!this._isIdle) {
            return;
        }

        this._onSpinBtnClick();
    };

    switchIdleDisabledTexture() {
        this._isIdle = !this._isIdle;
        this._btn.texture = this._isIdle == false ? this._btn_disabled : this._btn_idle;
    };

    onHover = () => {
        if (!this._isIdle) {
            return;
        }
        this._btn.texture = this._btn_hover;
    };

    onOut = () => {
        if (!this._isIdle) {
            return;
        }
        this._btn.texture = this._btn_idle;
    };

    get container(): PIXI.Container {
        return this._container;
    }

}
