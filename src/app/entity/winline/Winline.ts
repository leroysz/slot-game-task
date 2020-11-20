import {Combination} from "../combination/Combination";
import {Symbol} from "../Symbol";

export abstract class Winline {
    protected _id: number;
    protected _combinations: Array<Combination> = [];
    protected _symbolArr: Array<Symbol> = [];

    constructor(id: number) {
        this._id = id;
    }

    addSymbol(symbol: Symbol): void {
        this._symbolArr.push(symbol);
    }

    clearSymbolsArr() {
        this._symbolArr = [];
    }

    get symbolArr() {
        return this._symbolArr;
    }

    get id() {
        return this._id;
    }
}
