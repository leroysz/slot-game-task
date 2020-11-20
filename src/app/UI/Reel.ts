import Loader = PIXI.Loader;
import Container = PIXI.Container;


import {AppRunTimeException} from "../exception/AppRunTimeException";
import {Symbol} from "../entity/Symbol";

export type SpinResult = {
    topSymbol: Symbol;
    centralSymbol: Symbol;
    bottomSymbol: Symbol;
}

export class Reel {
    private _container: PIXI.Container;

    private _width: number;
    private _started = true;
    private _selectedSymbolId: number;
    private _selectedWinLineId: number;
    private _onEndSpin: () => void;
    private _symbolsPosArr: { [symbolId: number]: Symbol } = [];
    private _rotatedSymbolsArr: Symbol[];
    private _useCenterWinLine: boolean;
    private _frameWidth: number;
    private _rotationSpeedDenominant = 4;
    private _latestSpinRes: SpinResult;


    constructor(private _loader: Loader, frameWidth: number, private _idx: number, rotatedSymbolsArr: Symbol[], useCenterWinLine: boolean, private _app: PIXI.Application) {
        this._container = new Container();
        this._rotatedSymbolsArr = rotatedSymbolsArr;
        this._useCenterWinLine = useCenterWinLine;
        this._frameWidth = frameWidth;
        this.addSymbols();
    }

    addSymbols() {
        for (let i = 0; i < this._rotatedSymbolsArr.length; i++) {
            let rotatedSymbol = this._rotatedSymbolsArr[i];

            if (this._useCenterWinLine) {
                rotatedSymbol.y = Math.floor((rotatedSymbol.height * i) + (rotatedSymbol.height / 2));
            } else {
                rotatedSymbol.y = Math.floor(rotatedSymbol.height * i);
            }
            this._symbolsPosArr[rotatedSymbol.id] = rotatedSymbol;

            this._container.addChild(rotatedSymbol);
        }

        //if we initialize this reel with a central winline, then the last symbol needs to be visible at the top
        if (this._useCenterWinLine) {
            let bottomMostSymbol = this._symbolsPosArr[this._rotatedSymbolsArr[this._rotatedSymbolsArr.length - 1].id];
            bottomMostSymbol.y = -Math.floor((bottomMostSymbol.height / 2));
        }

    }

    get container(): PIXI.Container {
        return this._container;
    }

    get width(): number {
        return this._width;
    }

    start(selectedSymbolIdx: number, selectedWinLineIdx: number, onEndSpin: () => void, reelDelay: number) {
        this._started = true;
        this._selectedSymbolId = selectedSymbolIdx;
        this._onEndSpin = onEndSpin;
        this._selectedWinLineId = selectedWinLineIdx;
        this.scheduleReelStop(reelDelay);

        this._app.ticker.add(this.startSpinning, this);

    }

    private forceStop() {
        this._started = false;
    }

    private scheduleReelStop = (reelDelay: number) => {

        setTimeout(this.forceStop.bind(this), reelDelay);
    };


    private moveSymbols(moveToReqPos: boolean = false, yStepSize: number = 0) {
        for (let i = 0; i < this._rotatedSymbolsArr.length; i++) {
            const rotatedSymbol = this._symbolsPosArr[i];

            if (moveToReqPos) {
                rotatedSymbol.y -= yStepSize;
            } else {
                rotatedSymbol.y -= Math.floor(rotatedSymbol.height / this._rotationSpeedDenominant);//selectedSymbol.centerWinLineY / this._rotationSpeedDenominant;
            }

            if (rotatedSymbol.y <= -rotatedSymbol.height) {
                rotatedSymbol.y = ((this._rotatedSymbolsArr.length - 1) * rotatedSymbol.height) - Math.floor(rotatedSymbol.height / this._rotationSpeedDenominant);//selectedSymbol.centerWinLineY;
            }

        }
    }

    private getSelectedWinLineHeight(selectedSymbol: Symbol) {
        let selectedWinLineHeight: number;
        if (this._selectedWinLineId == 0) {
            selectedWinLineHeight = selectedSymbol.topWinLineY;
        } else if (this._selectedWinLineId == 1) {
            selectedWinLineHeight = selectedSymbol.centralWinLineY;
        } else if (this._selectedWinLineId == 2) {
            selectedWinLineHeight = selectedSymbol.bottomWinLineY;
        } else {
            throw new AppRunTimeException("Reel.getSelectedWinLineHeight wrong _selectedWinLineId");
        }
        return selectedWinLineHeight;
    }

    private startSpinning() {
        const selectedSymbol = this._symbolsPosArr[this._selectedSymbolId];
        const selectedSymbolPosY = selectedSymbol.y;
        const selectSymbolPosDifference = Math.abs(selectedSymbolPosY - this.getSelectedWinLineHeight(selectedSymbol));
        const yPosChangeEveryTick = Math.floor(selectedSymbol.height / this._rotationSpeedDenominant);
        if (!this._started && selectSymbolPosDifference === 0) {
            this.calcLatestSpinRes();
            this._onEndSpin();
            this._app.ticker.remove(this.startSpinning, this);
        } else if (!this._started && selectSymbolPosDifference <= yPosChangeEveryTick) {
            this.moveSymbols(true, selectSymbolPosDifference);
        } else {
            this.moveSymbols();
        }
    };


    private calcLatestSpinRes() {

        let topSymbol: Symbol;
        let centralSymbol: Symbol;
        let bottomSymbol: Symbol;
        for (let i = 0; i < this._rotatedSymbolsArr.length; i++) {
            const symbol = this._symbolsPosArr[i];

            //check whether the symbol position equals to some win-line pos
            const symbolAndTopWinLineDifference = Math.abs(symbol.y - symbol.topWinLineY);
            const symbolAndCentralWinLineDifference = Math.abs(symbol.y - symbol.centralWinLineY);
            const symbolAndBottomWinLineDifference = Math.abs(symbol.y - symbol.bottomWinLineY);
            if (symbolAndTopWinLineDifference <= 1) {
                topSymbol = symbol;
                symbol.y = symbol.topWinLineY;
            } else if (symbolAndCentralWinLineDifference <= 1) {
                centralSymbol = symbol;
                symbol.y = symbol.centralWinLineY;
            } else if (symbolAndBottomWinLineDifference <= 1) {
                bottomSymbol = symbol;
                symbol.y = symbol.bottomWinLineY;
            }
        }

        this._latestSpinRes = {
            topSymbol: topSymbol,
            centralSymbol: centralSymbol,
            bottomSymbol: bottomSymbol
        };
    }

    get latestSpinRes(): SpinResult {
        return this._latestSpinRes;
    }

}
