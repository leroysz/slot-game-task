import * as PIXI from "pixi.js";
import Loader = PIXI.Loader;
import {PixiUtil} from "../util/PixiUtil";
import Text = PIXI.Text;
import Graphics = PIXI.Graphics;
import {Dropdown} from "../UI/Dropdown";
import {Config} from "../config/Config";
import {Labels} from "../config/Labels";
import {Frame} from "../UI/Frame";

export type DebugAreaOption = { reelId: number, symbolId: number, posId: number };

type DropdownRow = { symbolSetDropdown: Dropdown, optionSetDropdown: Dropdown };

export class DebugArea {
    private readonly _container = new PIXI.Container();

    private _selectedOptionsArr: Array<DebugAreaOption>;

    private _dropdownRowArr: Array<DropdownRow> = [];

    private _randomModeEnabledIndicator: Graphics;
    private _fixedModeEnabledIndicator: Graphics;
    private _randomModeEnabled = true;
    private _symbolNameArr: Array<{ name: string, id: number }>;

    constructor(private _loader: Loader, private _app: PIXI.Application, reelsNum: number, frame: Frame) {
        PixiUtil.createBackground(this._container, 350, 450, 0, 0);
        this._container.sortableChildren = true;
        this._container.x = 900;
        this._container.y = frame.container.y;

        this.createTitle();

        this._symbolNameArr = Config.reel_symbols_order.map((elem, i) => {
            return {name: elem.name.slice(0, -4), id: i}
        });

        let xOffset = 45;

        for (let i = 0; i < reelsNum; i++) {
            let yOffset = 75;
            const dropdownRow = this.createInputsParamsForReel('Reel nr ' + (i + 1), xOffset, yOffset + 80 * i, i, reelsNum);
            this._dropdownRowArr.push(dropdownRow);
        }

        const buttonSize = 25;
        this.createModeBtn(xOffset, 350, 'Random mode', buttonSize, true, this.randomModePressed);
        this.createModeBtn(xOffset + 125, 350, 'Fixed mode', buttonSize, false, this.fixedModePressed);
    }

    createTitle() {
        let titleStyle = {
            align: "center",
            fontFamily: 'Arial',
            fontWeight: 'bold',
            fontSize: 24,
            fill: '#000000'
        };

        let title = new Text(Labels.debugAreaTitle, titleStyle);
        title.position.set(100, 15);
        this._container.addChild(title);
    }

    getDebugAreaOptionArr() {
        this._selectedOptionsArr = [];
        this._dropdownRowArr.forEach((dropdownRow, i) => {

            let symbolId = -1;
            this._symbolNameArr.forEach((elem) => {
                if (elem.name === dropdownRow.symbolSetDropdown.selectedOption.text) {
                    symbolId = elem.id
                }
            });

            let posOption = dropdownRow.optionSetDropdown.selectedOption.text;
            if (!posOption || symbolId === -1) {
                return;
            }
            let optionRow: DebugAreaOption = {
                reelId: i,
                symbolId: symbolId,
                posId: posOption == 'top' ? 0 : posOption == 'center' ? 1 : 2
            };
            this._selectedOptionsArr.push(optionRow);
        });
        return this._selectedOptionsArr;
    }

    randomModePressed = () => {
        this._fixedModeEnabledIndicator.visible = false;
        this._randomModeEnabledIndicator.visible = true;
        this._randomModeEnabled = true;
        this._dropdownRowArr.forEach((dropdownRow) => {
            dropdownRow.symbolSetDropdown.dropdown.visible = false;
            dropdownRow.symbolSetDropdown.dropdownBtn.interactive = false;
            dropdownRow.symbolSetDropdown.dropdownBtn.buttonMode = false;

            dropdownRow.optionSetDropdown.dropdown.visible = false;
            dropdownRow.optionSetDropdown.dropdownBtn.interactive = false;
            dropdownRow.optionSetDropdown.dropdownBtn.buttonMode = false;
        });

    };

    fixedModePressed = () => {
        this._randomModeEnabledIndicator.visible = false;
        this._fixedModeEnabledIndicator.visible = true;
        this._randomModeEnabled = false;
        this._dropdownRowArr.forEach((dropdownRow) => {
            dropdownRow.symbolSetDropdown.dropdownBtn.interactive = true;
            dropdownRow.symbolSetDropdown.dropdownBtn.buttonMode = true;

            dropdownRow.optionSetDropdown.dropdownBtn.interactive = true;
            dropdownRow.optionSetDropdown.dropdownBtn.buttonMode = true;
        });
    };

    createModeBtn(xPos: number, yPos: number, labelTxt: string, buttonSize: number, isRandomModeSelector: boolean, ontapCallback: () => void) {


        let label = new Text(
            labelTxt, {
                fontSize: 15,
                fontFamily: "Arial",
                fill: "#000000"
            }
        );
        label.position.set(xPos, yPos - label.height - 10);
        this._container.addChild(label);

        let modeSwitchBtn = new Graphics();
        modeSwitchBtn.lineStyle(1, 0x000000, 1);
        modeSwitchBtn.beginFill(0xFFFFFF);
        modeSwitchBtn.drawRect(xPos, yPos, buttonSize, buttonSize);
        modeSwitchBtn.endFill();
        modeSwitchBtn.interactive = true;
        modeSwitchBtn.buttonMode = true;
        modeSwitchBtn.visible = true;
        modeSwitchBtn.addListener('pointertap', ontapCallback);

        this._container.addChild(modeSwitchBtn);

        let modeEnabledIndicator = new Graphics();
        modeEnabledIndicator.beginFill(0xFF0000);
        modeEnabledIndicator.drawCircle(xPos + buttonSize / 2, yPos + buttonSize / 2, buttonSize / 2);
        modeEnabledIndicator.endFill();
        if (isRandomModeSelector) {
            modeEnabledIndicator.visible = true;
            this._randomModeEnabledIndicator = modeEnabledIndicator;
        } else {
            modeEnabledIndicator.visible = false;
            this._fixedModeEnabledIndicator = modeEnabledIndicator;
        }
        this._container.addChild(modeEnabledIndicator);
    }


    createInputsParamsForReel(reelTitle: string, xPos: number, yPos: number, idx: number, reelsNum: number) {
        const reelTitleStyle = {
            fontSize: 20,
            font: 'Arial',
            fill: 0x000000,
            fontWeight: 'bold'
        };
        let reelTitleText = new Text(reelTitle, reelTitleStyle);
        reelTitleText.x = xPos + 87;
        reelTitleText.y = yPos;
        this._container.addChild(reelTitleText);

        const symbolSetDropdown = this.createDropdownOfSymbols(xPos, yPos + reelTitleText.height, idx, reelsNum);

        const optionSetDropdown = this.createDropdownOfPositions(xPos, yPos + reelTitleText.height, idx, reelsNum);

        let dropdownRow: DropdownRow = {
            symbolSetDropdown: symbolSetDropdown,
            optionSetDropdown: optionSetDropdown
        };

        return dropdownRow;

    }


    createDropdownOfSymbols(xPos: number, yPos: number, idx: number, reelsNum: number) {

        const symbolSetDropdown = new Dropdown(this._symbolNameArr[0].name, 'Pick symbol', this._symbolNameArr.map((elem) => elem.name), this._app);
        symbolSetDropdown.container.zIndex = reelsNum + 1 - idx;
        symbolSetDropdown.container.x = xPos;
        symbolSetDropdown.container.y = yPos;
        this._container.addChild(symbolSetDropdown.container);
        return symbolSetDropdown;
    }

    createDropdownOfPositions(xPos: number, yPos: number, idx: number, reelsNum: number) {
        let options = ['top', 'center', 'bottom'];
        const optionSetDropdown = new Dropdown(options[0], 'Pick position', options, this._app);
        optionSetDropdown.container.x = xPos + 160;
        optionSetDropdown.container.y = yPos;
        optionSetDropdown.container.zIndex = reelsNum + 1 - idx;
        this._container.addChild(optionSetDropdown.container);
        return optionSetDropdown;
    }

    get container(): PIXI.Container {
        return this._container;
    }

    get randomModeEnabled() {
        return this._randomModeEnabled;
    }
}
