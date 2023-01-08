/* eslint-disable*/
const path = require('path');
const url = require('url');

const customTitlebar = require('custom-electron-titlebar');

window.addEventListener('DOMContentLoaded', () => {
  new customTitlebar.Titlebar({
    backgroundColor: customTitlebar.Color.fromHex('#e91e63'),
    shadow: false,
    icon: url.format(path.join(__dirname, '/images', '/icons', '/bergame.png'))
  });
});
