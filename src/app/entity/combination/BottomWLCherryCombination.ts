import {Combination} from "./Combination";
import {Winline} from "../winline/Winline";

export class BottomWLCherryCombination extends Combination {

    checkWinLines(winLines: Winline[]): number {
        let matchedWinLineYPos = null;
        if (winLines && winLines[2]) {
            const bottomWinLine = winLines[2];
            if (bottomWinLine.symbolArr.length == 3 && bottomWinLine.symbolArr.every(
                (symbol) => symbol && symbol.id === 4
            )) {
                matchedWinLineYPos = bottomWinLine.symbolArr[0].y + bottomWinLine.symbolArr[0].height;
            }
        }
        return matchedWinLineYPos;
    }

}
