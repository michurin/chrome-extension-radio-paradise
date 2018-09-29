/*
 * Radio Paradise player
 * Copyright (c) 2014-2018 Alexey Michurin <a.michurin@gmail.com>
 * MIT License [http://www.opensource.org/licenses/mit-license.php]
 */

'use strict';

(() => {

  const playerUrl = 'https://new.radioparadise.com/player';

  let openingLock = false;

  function getWindows() {
    return new Promise((resolve) => {
      chrome.windows.getAll({
        populate: true,
        windowTypes: ['popup'], // req chrome 46
      }, (ww) => {
        resolve(ww.filter(x => x.tabs && x.tabs.length === 1 && x.tabs[0].url && x.tabs[0].url.startsWith(playerUrl)));
      });
    });
  }

  function createWindow() {
    return new Promise((resolve) => {
      chrome.windows.create({
        url: playerUrl,
        width: 400,
        focused: true,
        type: 'popup',
      }, resolve);
    });
  }

  function updateWindow(wid) {
    return new Promise((resolve) => {
      chrome.windows.update(wid, {
        focused: true,
      }, resolve);
    });
  }

  function removeWindow(wid) {
    return new Promise((resolve) => {
      chrome.windows.remove(wid, resolve);
    });
  }

  async function createUpdateWindow() {
    try {
      if (openingLock) {
        return;
      }
      openingLock = true;
      const ww = await getWindows();
      if (ww.length === 0) {
        await createWindow();
      } else if (ww.length === 1) {
        await updateWindow(ww[0].id);
      } else {
        await Promise.all(ww.map(x => removeWindow(x.id)));
      }
    } finally {
      openingLock = false;
    }
  }

  // chrome.browserAction.onClicked.addListener(createUpdateWindow);
  chrome.extension.onMessage.addListener((request) => {
    if (request.action === 'modern_player') {
      setTimeout(createUpdateWindow, 100); // we have to give time to close popup to free focus on MacOS
    }
  });

})();
