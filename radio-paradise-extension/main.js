/*
 * Radio Paradise player
 * Copyright (c) 2014-2021 Alexey Michurin <a.michurin@gmail.com>
 * MIT License [http://www.opensource.org/licenses/mit-license.php]
 */
/* global chrome */

(() => {
  const version = chrome.runtime.getManifest().version;
  const rpUtm = 'chrome-extension-michurin';
  const rpDomain = 'radioparadise.com';
  const rpUrl = `https://${rpDomain}/player/?utm_source=${rpUtm}&utm_content=${version}`;
  const rpUrlPattern = `*://*.${rpDomain}/*`;

  const storageSet = v => new Promise((resolve) => {
    chrome.storage.local.set({ prevTab: v }, resolve);
  });

  const storageGet = () => new Promise((resolve) => {
    chrome.storage.local.get('prevTab', (r) => {
      if (r && r.prevTab) {
        resolve(r.prevTab);
      } else {
        resolve();
      }
    });
  });

  const queryTab = q => new Promise((resolve) => {
    chrome.tabs.query(q, resolve);
  });

  const queryOneTab = async (q) => {
    const t = await queryTab(q);
    if (t.length === 0) {
      return undefined;
    }
    return t[0];
  };

  const queryRPTab = async () => { // return random audio tab or random RP-url tab or undefined
    let t = await queryOneTab({ audible: true });
    if (t) {
      return t;
    }
    t = await queryOneTab({ url: rpUrlPattern });
    if (t) {
      return t;
    }
    return undefined;
  };

  // TODO: catch errors no-tab, no-window
  const activateTab = ({ windowId, id }) => new Promise((resolve) => {
    chrome.windows.update(windowId, { focused: true }, () => {
      chrome.tabs.update(id, { active: true }, resolve);
    });
  });

  chrome.browserAction.onClicked.addListener(async () => {
    const candidat = await queryRPTab();
    const curent = await queryOneTab({ active: true, currentWindow: true });
    let swithTo;
    if (candidat) {
      swithTo = candidat;
      if (curent) {
        if (candidat.id === curent.id) {
          const prevTab = await storageGet();
          if (prevTab && prevTab.id && prevTab.windowId) {
            swithTo = prevTab;
          }
        } else {
          await storageSet(curent);
        }
      }
      await activateTab(swithTo);
    } else {
      if (curent) {
        await storageSet(curent);
      }
      chrome.tabs.create({
        url: rpUrl,
        index: 0, // leftmost
      });
    }
  });
})();

// vim: ai:ts=2:sts=2:sw=2
