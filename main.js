const NAME = 'Meteogram';

const { app, BrowserWindow, Tray, Menu } = require('electron');
const locations = require('./meteo-api/locations');
const meteogram = require('./meteo-api/meteogram');

let currentLocation = locations[0];

let displayWindow = null;
let tray = null;

const locMenu = locations.map(x => ({ label: x.name, type: 'radio', checked: x.id === currentLocation.id, click: () => { currentLocation = x; } }));

const quitMenu = [
    { type: 'separator' },
    { label: 'Quit', role: 'quit' },
];

const menu = Menu.buildFromTemplate(locMenu.concat(quitMenu));

app.setName(NAME);
app.dock.hide();
app.on('ready', () => {
  tray = new Tray('resources/snowflake.png');
  tray.setToolTip(NAME);
  tray.on('right-click', () => tray.popUpContextMenu(menu));

  displayWindow = new BrowserWindow({ width: 930, height: 850 });
  displayWindow.hide(); // hidden by default.

  displayWindow.on('show', () => {
    tray.setHighlightMode('always');
    const url = meteogram.getMeteogramUrl(currentLocation);
    displayWindow.loadURL(url);
  });

  displayWindow.on('hide', () => {
    tray.setHighlightMode('never');
  });

  tray.on('click', () => { displayWindow.isVisible() ? displayWindow.hide() : displayWindow.show(); });
});
