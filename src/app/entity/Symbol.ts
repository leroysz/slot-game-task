import Loader = PIXI.Loader;

export class Symbol extends PIXI.Sprite {
    private _id: number;
    private _textureName: string;
    private _topWinLineY: number;
    private _centralWinLineY: number;
    private _bottomWinLineY: number;


    constructor(id: number, loader?: Loader, resourceKey?: string, textureName?: string) {
        super(loader ? loader.resources[resourceKey].textures[textureName] : undefined);
        this._id = id;
        this._textureName = textureName;
        this.calculateYCoordsForAllWinLines();
    }

    calculateYCoordsForAllWinLines() {
        this._topWinLineY = 0;
        this._centralWinLineY = Math.floor((this.height) - (this.height / 2));
        this._bottomWinLineY = Math.floor(this.height);
    }

    get id() {
        return this._id;
    }

    get topWinLineY(): number {
        return this._topWinLineY;
    }

    get centralWinLineY(): number {
        return this._centralWinLineY;
    }

    get bottomWinLineY(): number {
        return this._bottomWinLineY;
    }

}
