import {Reel, SpinResult} from "../UI/Reel";
import Loader = PIXI.Loader;
import {Config} from "../config/Config";
import {MathUtil} from "../util/MathUtil";
import {ArrayUtil} from "../util/ArrayUtil";
import * as PIXI from "pixi.js";
import {Frame} from "../UI/Frame";
import {Winline} from "../entity/winline/Winline";
import {Symbol} from "../entity/Symbol";
import {DebugAreaOption} from "./DebugArea";


export class ReelsComponent {

    private readonly _container: PIXI.Container = new PIXI.Container();
    /*
    init inside constructor
     */
    private _reelsArr: Array<Reel> = [];
    private _leftBorderWidth = 12;
    private _reelColumnWidth = 6;
    private _magicTopMargin = 10;
    private _frameTopRowHeight = 8;
    private _frameBottomRowHeight = 9;
    private _latestSpinResArr: Array<SpinResult> = [];
    private _winLines: Array<Winline>;


    constructor(private _loader: Loader, private _addContainerToStage: (container: PIXI.Container) => void, private _frameWidth: number, private _frame: Frame, private _app: PIXI.Application, private _reels_num: number, winLines: Winline[]) {
        //revert it
        this._winLines = winLines;
        this._container.position.x = Math.floor(this._frame.container.position.x + this._leftBorderWidth);
        this._container.position.y = Math.floor(this._frame.container.position.y + this._frameTopRowHeight); //+ this._magicTopMargin;
        this.createReels();
        this.hideOverflowSymbols();
    }

    createReels() {
        for (let i: number = 0; i < this._reels_num; i++) {
            let rotatedSymbolsArr: Array<Symbol>;
            rotatedSymbolsArr = this.getRotatedSymbolArr();
            let useCenterWinLine: boolean = MathUtil.getRandomInt(0, 2) == 1;
            let reel = new Reel(this._loader, this._frameWidth, i, rotatedSymbolsArr, useCenterWinLine, this._app);
            reel.container.position.x = Math.floor((reel.container.width + this._reelColumnWidth) * i);
            this._reelsArr.push(reel);
            this._container.addChild(reel.container);
        }
    }

    get container(): PIXI.Container {
        return this._container;
    }

    getRotatedSymbolArr(): Symbol[] {
        let rotatedArr: { id: number, name: string }[] = ArrayUtil.rotate(Config.reel_symbols_order, MathUtil.getRandomInt(0, Config.reel_symbols_order.length));
        return rotatedArr.map((symbol) => {
            return new Symbol(symbol.id, this._loader, 'spritesheet', symbol.name);
        });
    }

    hideOverflowSymbols() {
        let thing = new PIXI.Graphics()
            .beginFill(0xFFFFFF)
            .drawRect(this.container.x,
                this._container.y,
                this._container.width,
                this._frame.container.height - this._frameTopRowHeight - this._frameBottomRowHeight)
            .endFill();

        this.container.mask = thing;
    }

    rotate(onSpinEnd: () => void, spinOptions: Array<DebugAreaOption>) {

        this._latestSpinResArr = [];
        this._winLines.forEach(winLine => winLine.clearSymbolsArr());

        const reelSpinDuration = 1500;
        for (let i = 0; i < this._reelsArr.length; i++) {
            let selectedSymbolIndex: number;
            let selectedWinLineIdx: number;
            let reelDelay = 500;
            reelDelay = (reelDelay * i);
            /*
            TODO:iga reelile lisada oma valitud symboli ja winLine'i
             */
            let customOptions = false;
            spinOptions.forEach((elem) => {
                if (customOptions)
                    return;
                if (elem.reelId === i) {
                    selectedSymbolIndex = elem.symbolId;
                    selectedWinLineIdx = elem.posId;
                    customOptions = true;
                }
            });

            if (!customOptions) {
                selectedSymbolIndex = MathUtil.getRandomInt(0, Config.reel_symbols_order.length);
                selectedWinLineIdx = MathUtil.getRandomInt(0, 3);
            }

            let reel = this._reelsArr[i];
            reel.start(selectedSymbolIndex, selectedWinLineIdx, onSpinEnd, reelSpinDuration + reelDelay);
        }
    }

    getLatestSpinResArr(): Winline[] {
        for (let i = 0; i < this._reelsArr.length; i++) {
            let reel = this._reelsArr[i];
            this._latestSpinResArr.push(reel.latestSpinRes)
        }

        this._latestSpinResArr.map(res => res.topSymbol).forEach((topSymbol) => {
                this._winLines[0].addSymbol(topSymbol)
            }
        );
        this._latestSpinResArr.map(res => res.centralSymbol).forEach((centralSymbol) => {
                this._winLines[1].addSymbol(centralSymbol)
            }
        );
        this._latestSpinResArr.map(res => res.bottomSymbol).forEach((bottomSymbol) => {
                this._winLines[2].addSymbol(bottomSymbol)
            }
        );

        return this._winLines;
    }

}
