import * as PIXI from "pixi.js";
import Loader = PIXI.Loader;
import {Labels} from "../config/Labels";
import Text = PIXI.Text;
import Graphics = PIXI.Graphics;
import Sprite = PIXI.Sprite;
import {PixiUtil} from "../util/PixiUtil";
import {Combination} from "../entity/combination/Combination";
import {Winline} from "../entity/winline/Winline";
import {Symbol} from "../entity/Symbol";
import {BottomWLCherryCombination} from "../entity/combination/BottomWLCherryCombination";
import {TopWLCherryCombination} from "../entity/combination/TopWLCherryCombination";
import {CenterLCherryCombination} from "../entity/combination/CenterWLCherryCombination";
import {Seven3xCombination} from "../entity/combination/Seven3xCombination";
import {AnyCherry7Combination} from "../entity/combination/AnyCherry7Combination";
import {Bar3xCombination} from "../entity/combination/Bar3xCombination";
import {Bar2xCombination} from "../entity/combination/Bar2xCombination";
import {Bar1xCombination} from "../entity/combination/Bar1xCombination";
import {AnyBarCombination} from "../entity/combination/AnyBarCombination";


export class PaytableComponent {
    private readonly _container = new PIXI.Container();
    private _combinations: Array<Combination> = [];

    constructor(private _loader: Loader, private _app: PIXI.Application, private _winLines: Winline[]) {

        PixiUtil.createBackground(this._container, this._app.stage.width, 200, 0, 0);

        this.createTitle();

        const spriteWidth = 50;


        const contLeftOffset = 200;
        const contTopOffset = 25;


        this.createCherryArea(spriteWidth, contLeftOffset, contTopOffset);
        this.createVerticalLine(spriteWidth, contLeftOffset, contTopOffset);
        this.createRightSideArea(spriteWidth, contLeftOffset, contTopOffset);

        this._container.position.x = 0;
    }


    createTitle() {

        let titleStyle = {
            align: "center",
            fontFamily: 'Arial',
            fontWeight: 'bold',
            fontSize: 38,
            fill: '#6E3267'
        };

        let title = new Text(Labels.payTableTitle, titleStyle);
        title.x = (this._app.stage.width / 2) - (title.width / 2);
        this._container.addChild(title);
    }

    createCherryArea(spriteWidth: number, contLeftOffset: number, contTopOffset: number) {

        const bottomCherryCombination = new BottomWLCherryCombination([new Symbol(4, this._app.loader, 'spritesheet', 'Cherry.png'), new Symbol(4, this._app.loader, 'spritesheet', 'Cherry.png'), new Symbol(4, this._app.loader, 'spritesheet', 'Cherry.png')]);
        const topCherryCombination = new TopWLCherryCombination([new Symbol(4, this._app.loader, 'spritesheet', 'Cherry.png'), new Symbol(4, this._app.loader, 'spritesheet', 'Cherry.png'), new Symbol(4, this._app.loader, 'spritesheet', 'Cherry.png')]);
        const centerCherryCombination = new CenterLCherryCombination([new Symbol(4, this._app.loader, 'spritesheet', 'Cherry.png'), new Symbol(4, this._app.loader, 'spritesheet', 'Cherry.png'), new Symbol(4, this._app.loader, 'spritesheet', 'Cherry.png')]);
        this._combinations.push(bottomCherryCombination);
        this._combinations.push(topCherryCombination);
        this._combinations.push(centerCherryCombination);

        //create sprites only for one of cherry combinations
        bottomCherryCombination.createSprites(this.container, contLeftOffset, contTopOffset, spriteWidth);

        //create cherry labels
        /*
        TODO:50 constanti asemel kasutada symbolite suurust
         */
        const cherryTextLeftOffset = contLeftOffset - 65;
        const cherryTextTopOffset = contTopOffset + 50;
        let bottomWinLineTextPos: number[] = [];
        const cherryLabels = [Labels.payTableBottomWL, Labels.payTableTopWL, Labels.payTableCenterWL];
        const bottomWLStyle = {
            fontSize: 15,
            fill: 0x000000,
            wordWrap: true,
            wordWrapWidth: 75,
            fontWeight: 'bold'
        };
        for (let i = 0; i < 3; i++) {

            let bottomWinLineText = new Text(cherryLabels[i], bottomWLStyle);
            bottomWinLineText.x = cherryTextLeftOffset;
            bottomWinLineText.y = cherryTextTopOffset + (bottomWinLineText.height * i) + 5 * i;
            bottomWinLineTextPos.push(bottomWinLineText.y);
            this._container.addChild(bottomWinLineText);
        }

        //create cherry winning sum
        const winningSumLeftOffset = cherryTextLeftOffset + 75;
        bottomCherryCombination.createWinningSum(this._container, Labels.bottomCherryWinningSum, winningSumLeftOffset, bottomWinLineTextPos[0] - 5);
        topCherryCombination.createWinningSum(this._container, Labels.topCherryWinningSum, winningSumLeftOffset, bottomWinLineTextPos[1] - 5);
        centerCherryCombination.createWinningSum(this._container, Labels.centerCherryWinningSum, winningSumLeftOffset, bottomWinLineTextPos[2] - 5);
    }


    createVerticalLine(spritesWidth: number, contLeftOffset: number, contTopOffset: number) {
        const verticalLineLeftOffset = contLeftOffset + 150;
        const verticalLineTopOffset = contTopOffset + spritesWidth / 4;
        const verticalLineWidth = 10;
        const verticalLineHeight = 150;

        const separator = new Graphics();
        separator.beginFill(0x0000DD)
            .drawRect(verticalLineLeftOffset, verticalLineTopOffset, verticalLineWidth, verticalLineHeight);
        this._container.addChild(separator);
    }


    createRightSideArea(spritesWidth: number, contLeftOffset: number, contTopOffset: number,) {

        //create 777 combination
        const upperElementsLeftOffset = contLeftOffset + 200;
        const upperElementsToptOffset = contTopOffset + (contTopOffset + spritesWidth / 4);
        const seven3xCombination = new Seven3xCombination([new Symbol(3, this._loader, 'spritesheet', '7.png'), new Symbol(3, this._loader, 'spritesheet', '7.png'), new Symbol(3, this._loader, 'spritesheet', '7.png')]);
        this._combinations.push(seven3xCombination);
        seven3xCombination.createSprites(this._container, upperElementsLeftOffset, upperElementsToptOffset, spritesWidth);
        seven3xCombination.createWinningSum(this._container, Labels.comb3x7WinningSum, upperElementsLeftOffset + 150, upperElementsToptOffset + 5);

        //create any-cherry-7 combination
        const combCherry7 = new AnyCherry7Combination([new Symbol(4, this._loader, 'spritesheet', 'Cherry.png'), new Symbol(3, this._loader, 'spritesheet', '7.png')]);
        this._combinations.push(combCherry7);

        const anyCherry7CombXpos = upperElementsLeftOffset + seven3xCombination.symbolSprites[0].width - 1;
        const lowerElementsTopOffset = upperElementsToptOffset + seven3xCombination.symbolSprites[0].height + 25;
        combCherry7.createSprites(this._container, anyCherry7CombXpos, lowerElementsTopOffset, spritesWidth);
        combCherry7.createWinningSum(this._container, Labels.combCherry7WinningSum, anyCherry7CombXpos + 100, lowerElementsTopOffset);

        const ANYSymbolTextStyle = {
            fontSize: 30,
            fill: 0x000000,
            wordWrap: true,
            wordWrapWidth: 75,
            fontWeight: 'bold'
        };
        let combCherry7AnyText = new Text(Labels.ANYSymbolText, ANYSymbolTextStyle);
        combCherry7AnyText.x = upperElementsLeftOffset - 15;
        combCherry7AnyText.y = lowerElementsTopOffset + 5;
        this._container.addChild(combCherry7AnyText);

        //create 3xBar3x combination
        const symbols3xBarLeftOffset = contLeftOffset + 450;
        const winningSum3xBarLeftOffset = symbols3xBarLeftOffset + 150;
        const bar3xCombination = new Bar3xCombination([new Symbol(0, this._loader, 'spritesheet', '3xBAR.png'), new Symbol(0, this._loader, 'spritesheet', '3xBAR.png'), new Symbol(0, this._loader, 'spritesheet', '3xBAR.png')]);
        this._combinations.push(bar3xCombination);
        bar3xCombination.createSprites(this._container, symbols3xBarLeftOffset, upperElementsToptOffset + 5, spritesWidth);
        bar3xCombination.createWinningSum(this._container, Labels.comb3xBARWinningSum, winningSum3xBarLeftOffset, upperElementsToptOffset + 5);

        //create 2xBar3x combination
        const bar2xCombination = new Bar2xCombination([new Symbol(2, this._loader, 'spritesheet', '2xBAR.png'), new Symbol(2, this._loader, 'spritesheet', '2xBAR.png'), new Symbol(2, this._loader, 'spritesheet', '2xBAR.png')]);
        this._combinations.push(bar2xCombination);
        bar2xCombination.createSprites(this._container, symbols3xBarLeftOffset, lowerElementsTopOffset, spritesWidth);
        bar2xCombination.createWinningSum(this._container, Labels.comb2xBARWinningSum, winningSum3xBarLeftOffset, lowerElementsTopOffset);


        //create 1xBar3x combination
        const symbols1xBarLeftOffset = contLeftOffset + 700;
        const winningSum1xBarLeftOffset = symbols1xBarLeftOffset + 150;
        const bar1xCombination = new Bar1xCombination([new Symbol(1, this._loader, 'spritesheet', 'BAR.png'), new Symbol(1, this._loader, 'spritesheet', 'BAR.png'), new Symbol(1, this._loader, 'spritesheet', 'BAR.png')]);
        this._combinations.push(bar1xCombination);
        bar1xCombination.createSprites(this._container, symbols1xBarLeftOffset, upperElementsToptOffset + 5, spritesWidth);
        bar1xCombination.createWinningSum(this._container, Labels.comb1xBARWinningSum, winningSum1xBarLeftOffset, upperElementsToptOffset + 5);

        //create 2xBar3x combination
        const anyBarCombination = new AnyBarCombination();
        this._combinations.push(anyBarCombination);
        anyBarCombination.createWinningSum(this._container, Labels.combAnyBarWinningSum, winningSum1xBarLeftOffset, lowerElementsTopOffset);

        const ANYBarSymbolTextStyle = {
            fontSize: 15,
            fill: 0x000000,
            wordWrap: true,
            wordWrapWidth: 125,
            fontWeight: 'bold'
        };
        let anyBarCombText = new Text(Labels.ANYBarCombinationText, ANYBarSymbolTextStyle);
        anyBarCombText.x = symbols1xBarLeftOffset + 5;
        anyBarCombText.y = lowerElementsTopOffset - 5;
        this._container.addChild(anyBarCombText);

    }


    get container(): PIXI.Container {
        return this._container;
    }

    get combinations() {
        return this._combinations;
    }


}
