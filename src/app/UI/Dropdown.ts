import Text = PIXI.Text;
import Container = PIXI.Container;
import Graphics = PIXI.Graphics;
import Application = PIXI.Application;

export class Dropdown {

    private _container = new Container();
    private _selectedText: string;
    private _label: Text;
    private _dropdownItemHeight = 30;
    private _dropdownItemWidth = 90;
    private _selectedOption: Text;
    private _enableInput = false;
    private _dropdown: Graphics;
    private _dropdownBtn: Graphics;


    constructor(selectedText: string, labelTxt: string, items: Array<string>, private _app: Application) {
        this._container.sortableChildren = true;
        this._selectedText = selectedText;
        this.createDropDown(labelTxt, items);
    }

    createLabel(labelTxt: string) {
        this._label = new Text(
            labelTxt,
            {
                fontSize: 15,
                fontFamily: 'Arial',
                fill: "#000000"
            }
        );
        this._label.position.set(0, 0);
        this._container.addChild(this._label);
    }

    createSeparator() {
        let line = new Graphics();
        line.lineStyle(1, 0x000000, 1);
        line.moveTo(0, this._label.y + this._label.height + this._dropdownItemHeight);

        line.lineTo(this._dropdownItemWidth, this._label.y + this._label.height + this._dropdownItemHeight);
    }

    createSelectedElement() {

        this._dropdownBtn = new Graphics();

        this._dropdownBtn.lineStyle(1, 0x000000, 1);
        this._dropdownBtn.beginFill(0xFFFFFF);
        this._dropdownBtn.drawRect(0, this._label.y + this._label.height, this._dropdownItemWidth, this._dropdownItemHeight);
        this._dropdownBtn.endFill();
        this._dropdownBtn.interactive = this._enableInput;
        this._dropdownBtn.buttonMode = this._enableInput;
        this._dropdownBtn.visible = true;
        this._dropdownBtn.addListener('pointertap', () => {
            this._dropdown.visible = !this._dropdown.visible;
        });
        this._container.addChild(this._dropdownBtn);


        this._selectedOption = new Text(
            '',
            {
                fontSize: 12,
                fontFamily: 'Arial',
                fill: 0x000000
            }
        );
        this._selectedOption.position.set(0, this._label.y + this._label.height + 10);
        this._selectedOption.interactive = true;
        this._dropdownBtn.addChild(this._selectedOption);

        var triangle = new Text(
            '▼',
            {
                fontSize: 15,
                fontFamily: 'Arial',
                fill: 0x000000
            }
        );
        triangle.position.set(this._dropdownItemWidth - 20, this._label.y + this._label.height + 7);
        this._dropdownBtn.addChild(triangle);
    }




    createDropDown(labelTxt: string, items: Array<string>) {


        this.createLabel(labelTxt);

        this._dropdown = new Graphics();
        this._dropdown.beginFill(0xc3c3c3);
        this._dropdown.drawRect(0, this._label.y + this._label.height + 4 + this._dropdownItemHeight, this._dropdownItemWidth + 5, items.length * this._dropdownItemHeight);
        this._dropdown.endFill();
        this._dropdown.interactive = true;
        this._dropdown.buttonMode = true;
        this._dropdown.visible = false;
        this._container.addChild(this._dropdown);

        this.createSeparator();
        this.createSelectedElement();
        this.insertItems(items);
    }


    insertItems(items: Array<string>) {

        items.forEach((item, i) => {

            let option = new Graphics();
            option.sortableChildren = true;
            option.beginFill(0xc3c3c3);
            option.drawRect(0, 63 + i * this._dropdownItemHeight, this._dropdownItemWidth + 5, this._dropdownItemHeight);
            option.endFill();
            option.interactive = true;
            option.buttonMode = true;
            this._dropdown.addChild(option);

            let optionText = new Text(
                item,
                {
                    fontSize: 12,
                    fontFamily: 'Arial',
                    fill: 0x000000
                }
            );

            optionText.interactive = true;
            option.addListener('pointertap', () => {
                this._selectedOption.text = optionText.text;
                this._dropdown.visible = false;
                this._label.style = {
                    fontSize: 15,
                    fontFamily: 'Arial',
                    fill: 0xc7c7c7
                };
                this._app.render();
            });


            optionText.position.set(0, 63 + i * this._dropdownItemHeight);
            option.addChild(optionText);
        });
    }

    get container() {
        return this._container;
    }

    get dropdown() {
        return this._dropdown;
    }

    get dropdownBtn() {
        return this._dropdownBtn;
    }

    get selectedOption() {
        return this._selectedOption;
    }

}
