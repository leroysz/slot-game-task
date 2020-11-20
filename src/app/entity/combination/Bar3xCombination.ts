import {Combination} from "./Combination";
import {Winline} from "../winline/Winline";

export class Bar3xCombination extends Combination{
    checkWinLines(winLines: Winline[]): number {
        let matchedWinLineYPos = null;
        if (winLines) {
            winLines.some((winLine) => {
                if (winLine.symbolArr.length === 3 && winLine.symbolArr.every(
                    (symbol) => symbol && symbol.id === 0
                )) {
                    matchedWinLineYPos = winLine.symbolArr[0].y + winLine.symbolArr[0].height;
                }
            })
        }

        return matchedWinLineYPos;
    }

}
