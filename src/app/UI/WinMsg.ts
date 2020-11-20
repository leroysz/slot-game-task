import Text = PIXI.Text;

export class WinMsg extends Text {

    private static _winMsgStyle = {
        fontFamily: 'Arial',
        fontWeight: 'bold',
        fontSize: 90,
        fill: '#eeee00',
        dropShadow: true,
        dropShadowColor: '#111',
        strokeThickness: 5,
    };

    constructor(msg: string, canvasWidth: number, canvasHeight: number) {
        super(msg, WinMsg._winMsgStyle);

        this.position.x = (canvasWidth) / 2;
        this.position.y = (canvasHeight) / 2;
        this.anchor.set(0.5, 0);
    }
}
