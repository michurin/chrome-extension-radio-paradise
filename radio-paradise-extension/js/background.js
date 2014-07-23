/*
 * Radio Paradise player
 * Copyright (c) 2014 Alexey Michurin <a.michurin@gmail.com>
 * MIT License [http://www.opensource.org/licenses/mit-license.php]
 */

/*global chrome */
/*global streams, storage, audio_controller, on_storage_change, toggle_playing_state, update_field */

'use strict';

(function () {

  var browser_action = chrome.browserAction;

  function init() {
    browser_action.setBadgeBackgroundColor({color: '#942'});
    storage.get({
      popup: true
    }, function (x) {
      browser_action.setPopup({popup: x.popup ? 'popup.html' : ''});
    });
  }

  function badge_updater(text) {
    return function () {
      browser_action.setBadgeText({text: text});
    };
  }

  // we must setup audio every time we load page

  (function () {
    browser_action.setBadgeBackgroundColor({color: '#942'});
    storage.get({
      volume: 0.75,
      playing: false,
      stream_id: streams.def.stream
    }, function (x) {
      update_field('last_init');
      storage.set({last_init_args: x});
      audio_controller.set_stream(streams.map[x.stream_id].url);
      audio_controller.set_volume(x.volume);
      audio_controller.set_state(x.playing);
    });
  }());

  // bindings (every loading too)

  browser_action.onClicked.addListener(toggle_playing_state); // fired only if popup not set
  audio_controller.set_callbacks(
    badge_updater('…'),
    badge_updater('►'),
    badge_updater(''),
    function () {
      update_field('last_stream_timeout');
      storage.set({playing: false});
    }
  );
  on_storage_change(function (ch) {
    if (ch.volume) {
      audio_controller.set_volume(ch.volume.newValue);
    } else if (ch.playing) {
      audio_controller.set_state(ch.playing.newValue);
    } else if (ch.stream_id) {
      audio_controller.set_stream(streams.map[ch.stream_id.newValue].url);
    } else if (ch.popup) {
      browser_action.setPopup({popup: ch.popup.newValue ? 'popup.html' : ''});
    }
  });
  chrome.runtime.onStartup.addListener(function () {
    // not fired on installed
    update_field('last_startup');
    init();
  });
  chrome.runtime.onInstalled.addListener(function () {
    update_field('last_install');
    init();
  });

  // reload if update available, but isn't installed immediately
  // because the background page is currently running
  chrome.runtime.onUpdateAvailable.addListener(function () {
    chrome.runtime.reload();
  });

}());
