import app from 'app';
import BrowserWindow from 'browser-window';
import notifier from './notifier';
import fs from 'fs';
import path from 'path';
import events from '../common/events';

const defaultWindowBounds = {
  width: 1024,
  height: 768
};

export default class Window {
  constructor (path) {
    
    Window.add(this);

    this.path = path;
    this.loaded = false;
    this.content = '';
    if (this.path) {
      this.content = fs.readFileSync(this.path, {encoding: 'utf8'});
    }

    this.browserWindow = new BrowserWindow(defaultWindowBounds);

    this.browserWindow.webContents.on('did-finish-load', this.onWindowLoaded.bind(this));
    this.browserWindow.loadUrl(`file://${__dirname}/../browser/index.html`);
    this.setTitle();
  }

  onWindowLoaded () {
    this.loaded = true;
    this.browserWindow.send(events.openfile, this.content);
  }

  setTitle () {
    var info = require('../package.json');

    if (this.path)
      this.browserWindow.setTitle(`${info.productName} - ${path.basename(this.path)}`);
  }

  //
  // Static methods
  //
  static add (window) {
    if (!this.windows)
      this.windows = [];

    this.windows.push(window);
  }

  static remove (window) {
    let windows = this.windows;

    if (!windows || windows.length === 0)
      return;

    const windowIndex = this.windows.indexOf(window);

    if (windowIndex >= 0) {
      windows.splice(windowIndex, 1);
    }
  }

  static closeAllWindows () {
    if (!this.windows)
      return;

    this.windows.forEach(window => window.close());
  }

  static hasWindows () {
    return !!this.windows && this.windows.length > 0;
  }

}