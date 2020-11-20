import {Combination} from "./Combination";
import {Winline} from "../winline/Winline";

export class TopWLCherryCombination extends Combination {

    checkWinLines(winLines: Winline[]): number {
        let matchedWinLineYPos = null;
        if (winLines && winLines[0]) {
            const topWinLine = winLines[0];
            if (topWinLine.symbolArr.length === 3 && topWinLine.symbolArr.every(
                (symbol) => symbol && symbol.id === 4
            )
            ) {
                matchedWinLineYPos = topWinLine.symbolArr[0].y + topWinLine.symbolArr[0].height;
            }
        }
        return matchedWinLineYPos;
    }

}
