import Container = PIXI.Container;
import {Symbol} from "../Symbol";
import {WinningSum} from "../../UI/WinningSum";
import {Winline} from "../winline/Winline";
import {PixiUtil} from "../../util/PixiUtil";
import Sprite = PIXI.Sprite;


export abstract class Combination {
    private _symbols: Symbol[];
    private _symbolSprites: Sprite[];
    private _winningSum: WinningSum;

    constructor(symbols?: Symbol[]) {
        this._symbols = symbols;
    }

    abstract checkWinLines(winLines: Winline[]): number;

    createSprites(container: Container, leftOffset: number, topOffset: number, symbolWidth: number): void {
        if (!this._symbolSprites) {
            this._symbolSprites = [];
        }
        for (let i = 0; i < this._symbols.length; i++) {
            let combSprite = this._symbols[i];
            PixiUtil.scaleSpriteProportionallyByWidth(combSprite, symbolWidth);
            combSprite.x = leftOffset + (combSprite.width * i) - (combSprite.width / 16) * i;
            combSprite.y = topOffset;

            this._symbolSprites.push(combSprite);
            container.addChild(combSprite);
        }
    }

    createWinningSum(container: Container, label: string, winningSumLeftOffset: number, winningSumTopOffset: number) {
        this._winningSum = new WinningSum(label, winningSumLeftOffset, winningSumTopOffset, Number(label));
        container.addChild(this._winningSum);
    }

    get symbolSprites() {
        return this._symbolSprites;
    }

    get winningSum() {
        return this._winningSum;
    }
}
