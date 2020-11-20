import {Frame} from "../UI/Frame";
import * as PIXI from "pixi.js";

import * as PTI from "pixi-textinput-v5";

import {Background} from "../UI/Background";
import {ReelsComponent} from "./ReelsComponent";
import {SpinBtn} from "../UI/SpinBtn";
import {WinMsg} from "../UI/WinMsg";
import {Winline} from "../entity/winline/Winline";
import {TopWinline} from "../entity/winline/TopWinline";
import {CenterWinline} from "../entity/winline/CenterWinline";
import {BottomWinline} from "../entity/winline/BottomWinline";
import {PaytableComponent} from "./PaytableComponent";
import {Combination} from "../entity/combination/Combination";
import Graphics = PIXI.Graphics;
import {DebugArea, DebugAreaOption} from "./DebugArea";
import {BalanceBox} from "./BalanceBox";


export type MachedCombination = {
    matchedWinLineYPos: number,
    matchedCombination: Combination
};

export class SlotMachineComponent {

    private _background: Background;
    private _frame: Frame;
    private _reelsComponent: ReelsComponent;
    private readonly _reels_num = 3;
    private _spinBtn: SpinBtn;
    private readonly rightBorderSize: number = 12;

    private _winMsg: WinMsg;
    private _spinningReels: number;
    private _winLines: Winline[] = [
        new TopWinline(0),
        new CenterWinline(1),
        new BottomWinline(2)
    ];

    private _payTableComponent: PaytableComponent;
    private _debugArea: DebugArea;
    private _balanceBox: BalanceBox;


    constructor(private _app: PIXI.Application) {

        this.createBackground();
        this.createFrame();
        this.createReels();
        this.createSpinButton();
        this.createPayTable();
        this.createDebugArea();
        this.createBalanceBox();
    }

    createBackground() {
        this._background = new Background(this._app.stage, this._app.loader);
    };

    createFrame() {

        this._frame = new Frame(this._app.loader, this._app.view.width, this._app.view.height, this._app);
        this.addContainerToStage(this._frame.container);
    }

    addContainerToStage = (container: PIXI.Container) => {
        this._app.stage.addChild(container);
    };

    createReels() {
        this._reelsComponent = new ReelsComponent(this._app.loader, this.addContainerToStage, this._frame.frameWidth, this._frame, this._app, this._reels_num, this._winLines);

        this.addContainerToStage(this._reelsComponent.container);
    }


    createSpinButton() {
        let frameCont = this._frame.container;
        this._spinBtn = new SpinBtn(this._app.loader, this.onSpinBtnClick, frameCont.x, frameCont.y, frameCont.width, frameCont.height)
        this.addContainerToStage(this._spinBtn.container);
    }

    onSpinBtnClick = () => {
        this._spinningReels = 0;
        if (this._balanceBox.coinsLeft > 0) {
            this._spinBtn.switchIdleDisabledTexture();
            this._balanceBox.coinsLeft = this._balanceBox.coinsLeft - 1;
            let spinOptions: Array<DebugAreaOption> = [];
            if (!this._debugArea.randomModeEnabled) {
                spinOptions = this._debugArea.getDebugAreaOptionArr();
            }
            this._reelsComponent.rotate(this.onSpinEnd, spinOptions);
        }
    };

    onSpinEnd = () => {
        this._spinningReels++;

        if (this._spinningReels === this._reels_num) {
            this._spinBtn.switchIdleDisabledTexture();
            let latestSpinResArr = this._reelsComponent.getLatestSpinResArr();
            this.checkForWin(latestSpinResArr);

        }
    };

    private createBalanceBox() {
        this._balanceBox = new BalanceBox();
        this.addContainerToStage(this._balanceBox.container);
    }


    makeWinSumsAndWinLinesBlink(machedCombinationArr: Array<MachedCombination>) {

        const blinkingDuration = 3000;
        const blinkingFrequency = 500;
        const markLineHeight = 10;

        const markedWinLines: Graphics[] = [];

        //create array of marked winlines
        machedCombinationArr.forEach((machedCombination) => {

            const markedWinLine = new Graphics();
            markedWinLine.beginFill(0xFF0000)
                .drawRect(15, machedCombination.matchedWinLineYPos - 5, this._reelsComponent.container.width - 30, markLineHeight);
            markedWinLine.visible = false;
            this._reelsComponent.container.addChild(markedWinLine);
            markedWinLines.push(markedWinLine);
        });

        let showElements = true;

        //make winlines and winning sums blink at the same time
        const intervalId = setInterval(() => {

            machedCombinationArr.forEach((machedCombination) => {
                const winningSum = machedCombination.matchedCombination.winningSum;
                winningSum.visible = showElements;

            });

            markedWinLines.forEach((markedWinLine) => {
                markedWinLine.visible = showElements;
            });


            showElements = !showElements;
        }, blinkingFrequency);

        setTimeout(() => {

            //show all winning sums
            machedCombinationArr.forEach((machedCombination) => {
                const winningSum = machedCombination.matchedCombination.winningSum;
                winningSum.visible = true;
            });

            //hide all winlines
            markedWinLines.forEach((markedWinLine) => {
                markedWinLine.visible = false;
            });

            window.clearInterval(intervalId);
        }, blinkingDuration);
    }


    checkForWin(winlines: Array<Winline>) {

        let machedCombinationArr: Array<MachedCombination> = [];
        this._payTableComponent.combinations.forEach((combination) => {
            let matchedWinLineYPos = null;
            if ((matchedWinLineYPos = combination.checkWinLines(winlines)) != null) {


                machedCombinationArr.push({
                    matchedWinLineYPos: matchedWinLineYPos,
                    matchedCombination: combination
                });

                //add money to player for each matched combination
                this._balanceBox.coinsLeft = this._balanceBox.coinsLeft + combination.winningSum.rewardAmount
            }

        });
        this.makeWinSumsAndWinLinesBlink(machedCombinationArr);
    }

    createPayTable() {
        this._payTableComponent = new PaytableComponent(this._app.loader, this._app, this._winLines);
        this.addContainerToStage(this._payTableComponent.container);
    }

    createDebugArea() {
        this._debugArea = new DebugArea(this._app.loader, this._app, this._reels_num, this._frame);
        this.addContainerToStage(this._debugArea.container);
    }


}
