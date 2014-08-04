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

  function update_popup_mode(mode) {
    browser_action.setPopup({popup: mode ? 'popup.html' : ''});
  }

  function update_badge_color(color) {
    browser_action.setBadgeBackgroundColor({color: color});
  }

  function init() {
    storage.get({
      popup: true,
      badge_background_color: '#942'
    }, function (x) {
      storage.set({last_init_args: x});
      update_popup_mode(x.popup);
      update_badge_color(x.badge_background_color);
    });
  }

  function badge_updater(text) {
    return function () {
      browser_action.setBadgeText({text: text});
    };
  }

  // we *MUST* init audio params every time page loaded
  // it is good reason to rewrite audio_ctl

  (function () {
    update_field('last_init');
    storage.get({
      volume: 0.75,
      playing: false,
      stream_id: streams.def.stream
    }, function (x) {
      storage.set({last_load_args: x});
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
    }
    if (ch.playing) {
      audio_controller.set_state(ch.playing.newValue);
    }
    if (ch.stream_id) {
      audio_controller.set_stream(streams.map[ch.stream_id.newValue].url);
    }
    if (ch.popup) {
      update_popup_mode(ch.popup.newValue);
    }
    if (ch.badge_background_color) {
      update_badge_color(ch.badge_background_color.newValue);
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
