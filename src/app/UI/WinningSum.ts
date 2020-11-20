import Text = PIXI.Text;

export class WinningSum extends Text {
    private _rewardAmount: number;
    private static winningSumStyle = {
        fontFamily: 'Arial',
        fontSize: 45,
        fill: 0xFF0000,
        fontWeight: 'bold',
    };

    constructor(label: string, xPos: number, yPos: number, rewardAmount: number) {
        super(label, WinningSum.winningSumStyle);
        this.setWinningSumPos(xPos, yPos);
        this._rewardAmount = rewardAmount;
    }

    setWinningSumPos(xPos: number, yPos: number) {
        this.x = xPos;
        this.y = yPos - (this.height / 8);
    }

    get rewardAmount(){
        return this._rewardAmount;
    }
}
