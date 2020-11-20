import * as PTI from "pixi-textinput-v5";
import Container = PIXI.Container;
import {TextInput} from "pixi-textinput-v5";

export class BalanceBox {
    private _container = new Container();
    private _balanceInput: TextInput;
    private _balanceOutput: TextInput;

    private _coinsLeft: number = 1;

    constructor() {
        this.createBalanceInput();
        this._container.x = 775;
        this._container.y = 500;
        this.createBalanceOutput();
    }


    createBalanceOutput() {
        this._balanceOutput = new PTI.TextInput({
            input: {
                fontSize: '16pt',
                padding: '3px',
                width: '75px',
                color: '#26272E'
            },
            box: {fill: 0x999999}
        });
        this._balanceOutput.x = 0;
        this._balanceOutput.y = 0;
        // @ts-ignore
        this._balanceOutput.maxLength = 4;
        // @ts-ignore
        this._balanceOutput.disabled = true;
        // @ts-ignore
        this._balanceOutput.text = this._coinsLeft;
        this._container.addChild(this._balanceOutput);
    }

    createBalanceInput() {

        this._balanceInput = new PTI.TextInput({
            input: {
                fontSize: '16pt',
                padding: '3px',
                width: '75px',
                color: '#26272E'
            },
            box: {fill: 0xEEEEEE}
        });
        this._balanceInput.x = 0;
        this._balanceInput.y = 40;
        // @ts-ignore
        this._balanceInput.maxLength = 4;
        // @ts-ignore
        this._balanceInput.restrict = "[0-9]{0,4}";

        // @ts-ignore
        this._balanceInput.text = this._coinsLeft;
        this._container.addChild(this._balanceInput);

        let prevBalanceVal: string;
        this._balanceInput.addListener('keydown', (keycode: number) => {
            // @ts-ignore
            prevBalanceVal = this._balanceInput.text;

            let input: string;

            if (keycode >= 96 && keycode <= 105) {
                input = String.fromCharCode(keycode - 48);
            } else {
                input = String.fromCharCode(keycode);
            }

            if (!isNaN(Number(input))) {
                const newInt = Number(this._balanceInput.text + input);
                if (newInt >= 1 && newInt <= 5000) {
                    prevBalanceVal = prevBalanceVal + input;
                }
            } else if (keycode === 8 || keycode === 46) {
                if (prevBalanceVal.length >= 1) {
                    prevBalanceVal = prevBalanceVal.slice(0, -1);
                }
            }
        });

        this._balanceInput.addListener('input', (text: string) => {
            this.coinsLeft = Number(prevBalanceVal);
        });

    }

    get container() {
        return this._container;
    }


    get coinsLeft() {
        return this._coinsLeft;
    }

    set coinsLeft(coinsLeft: number) {
        this._coinsLeft = coinsLeft;
        // @ts-ignore
        this._balanceOutput.text = coinsLeft;
        // @ts-ignore
        this._balanceInput.text = coinsLeft;
    }
}
