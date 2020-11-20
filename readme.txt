The app is build using TypeScript, Webpack as web server and Pixi.js as 2D canvas renderer. For the sake of simplicity i haven't used ECS patterns or any app state management library. Webpack is configured to translate typescript into ES5 compliant JS code by using `target: ['web', 'es5']`. The support for mobile portrait and landscape mode is not implemented. The current version is not optimized performance wise, so let's hope the typescript compiler is smart enough.

Some functionality is written using such OOP features like inheritance (hierarchy of combinations/winlines) or polymorphism (when checking for winning combinations the SlotMachine is calling parent method of Combination class, but that child class will get actually called will be known only at runtime.

Although, the symbol images that were provided with this task have same height (121 px), i assumed that the height of symbol images may vary. This means that the coordinates of all win-lines may differ for each symbol. The coordinates of the win-lines for each symbol is calculated during the creation of 1 of 3 reels.

To implement text input (used by BalanceBox.ts) a plugin for pixi https://github.com/Mwni/PIXI.TextInput were used.

The release files (with index.html as entry-point) are located in dist folder.
