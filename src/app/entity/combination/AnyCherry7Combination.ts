import {Combination} from "./Combination";
import {Winline} from "../winline/Winline";

export class AnyCherry7Combination extends Combination {

    checkWinLines(winLines: Winline[]): number {
        let matchedWinLineYPos = null;
        if (winLines) {
            winLines.forEach((winLine) => {

                if (winLine.symbolArr.length >= 2 &&
                    //check that the 3rd reel also have same position (using center or bottom/top)
                    winLine.symbolArr.every((symbol) => symbol) &&
                    winLine.symbolArr.some((symbol) => symbol && symbol.id === 4) &&
                    winLine.symbolArr.some((symbol) => symbol && symbol.id === 3)
                ) {
                    matchedWinLineYPos = winLine.symbolArr[0].y + winLine.symbolArr[0].height;
                }
            })
        }

        return matchedWinLineYPos;
    }

}
