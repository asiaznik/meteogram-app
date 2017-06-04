const NAME = 'Meteogram';

const { app, BrowserWindow, Tray, Menu, ipcMain } = require('electron');
const locations = require('./meteo-api/locations');
const meteogram = require('./meteo-api/meteogram');

let currentLocation = locations.defaultLocations[0];

let displayWindow = null;
let settingsWindow = null;
let tray = null;

const locMenu = locations.defaultLocations.map(x => ({
  label: x.name,
  type: 'radio',
  checked: x.id === currentLocation.id,
  click: () => { currentLocation = x; } }));

function activateSettingsWindow() {
  settingsWindow = new BrowserWindow({ width: 300, height: 200 });
  settingsWindow.loadURL(`file://${__dirname}/settings.html`);
}

const coreMenu = [
    { type: 'separator' },
    { label: 'Settings', click: activateSettingsWindow },
    { label: 'Quit', role: 'quit' },
];

const menu = Menu.buildFromTemplate(locMenu.concat(coreMenu));

app.setName(NAME);
if (/darwin/.test(process.platform)) app.dock.hide();
app.on('ready', () => {
  tray = new Tray('./resources/images/snowflake.png');
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

ipcMain.on('set-location', (e, data) => {
  currentLocation = data;
});
ipcMain.on('get-state', (e) => {
  e.sender.send('get-state-reply', currentLocation);
});
