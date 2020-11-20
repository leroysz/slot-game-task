import {Combination} from "./Combination";
import {Winline} from "../winline/Winline";

export class CenterLCherryCombination extends Combination {

    checkWinLines(winLines: Winline[]): number {
        let matchedWinLineYPos = null;
        if (winLines && winLines[1]) {
            const centerWinLine = winLines[1];
            if (centerWinLine.symbolArr.length === 3 && centerWinLine.symbolArr.every(
                (symbol) => symbol && symbol.id === 4
            )) {
                matchedWinLineYPos = centerWinLine.symbolArr[0].y + centerWinLine.symbolArr[0].height;
            }
        }
        return matchedWinLineYPos;
    }

}
