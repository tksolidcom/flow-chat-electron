const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
//const log = require("electron-log");

// グローバルなウィンドウオブジェクトの参照を保持しておく
let mainWindow;
let channelWindow;

function createMainWindow() {
  // メインウィンドウを作成
  mainWindow = new BrowserWindow({
    width: 800,
    height: 700,
    webPreferences: {
      // eslint-disable-next-line no-undef
      preload: path.join(__dirname, "preload.js"),
    },
  });
  // メインウィンドウの内容をロード
  mainWindow.loadFile("app/pages/index/index.html");

  // メインウィンドウが閉じられたときの処理
  mainWindow.on("closed", () => {
    // ウィンドウオブジェクトを破棄する
    app.quit();
  });
}

function createChannelWindow(channelOptions) {
  // 新しいウィンドウを作成
  channelWindow = new BrowserWindow({
    width: 800,
    height: 600,
    alwaysOnTop: true, // 常時トップ表示
    transparent: true, // ウィンドウの透過
    frame: false, // ウィンドウのフレーム非表示
    webPreferences: {
      // eslint-disable-next-line no-undef
      preload: path.join(__dirname, "preload.js"),
    },
  });

  // ウィンドウ最大化
  channelWindow.maximize();

  // マウスイベントを無視する
  channelWindow.setIgnoreMouseEvents(true);

  // 新しいウィンドウの内容をロード
  channelWindow.loadFile("app/pages/channel/channel.html");

  // レンダラープロセスにチャンネル名を渡す
  channelWindow.webContents.on("did-finish-load", () => {
    console.log("did finish load");
    console.log(channelOptions);
    channelWindow.webContents.send("channelOptions", channelOptions);
  });

  // 新しいウィンドウが閉じられたときの処理
  channelWindow.on("closed", () => {
    // ウィンドウオブジェクトを破棄する
    channelWindow = null;
  });

  // 他のウィンドウを全画面表示（厳密には単なる全画面表示ではないが、表現が分からないので）したとき、チャンネルウィンドウが背面に行ってしまう問題を抑制
  setInterval(() => {
    console.log("focus on setTimeout");
    channelWindow.moveTop();
  }, 700);
}

// Electronの準備ができたときの処理
app.on("ready", createMainWindow);

// 全てのウィンドウが閉じられたときの処理
app.on("window-all-closed", () => {
  // macOSでは、ウィンドウが閉じられてもアプリケーションが終了しないのが一般的なため、
  // 明示的に終了する必要がある
  // eslint-disable-next-line no-undef
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// アプリケーションがアクティブになったときの処理（macOS用）
app.on("activate", () => {
  // macOSでは、Dockアイコンがクリックされ、他のウィンドウが開いていないときに、
  // メインウィンドウを再作成するのが一般的なため、その処理を行う
  if (mainWindow === null) {
    createMainWindow();
  }
});

// 入室ボタンがクリックされたときの処理
ipcMain.handle("channelNameEntered", (event, channelOptions) => {
  console.log(channelOptions);
  createChannelWindow(channelOptions);
});

// フォントサイズの変更
ipcMain.handle("changeFontSize", (event, fontSize) => {
  console.log(`changeFontSize:${fontSize}`);
  if (existChannelWindow()) {
    channelWindow.webContents.send("changeFontSize", fontSize);
  }
});

ipcMain.handle("changeColor", (event, color) => {
  console.log(`changeColor:${color}`);
  if (existChannelWindow()) {
    channelWindow.webContents.send("changeColor", color);
  }
});

const existChannelWindow = () => {
  return !!channelWindow;
};
