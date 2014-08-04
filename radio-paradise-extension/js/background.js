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
  storage.get({
    volume: 0.75,
    playing: false,
    stream_id: streams.def.stream
  }, function (x) {
    update_field('last_init');
    storage.set({last_load_args: x});
    // step 0: init audio callbacks
    audio_controller.set_callbacks(
      badge_updater('…'),
      badge_updater('►'),
      badge_updater(''),
      function (failed_url) {
        update_field('last_stream_timeout');
        storage.set({last_stream_timeout_url: failed_url});
        storage.set({playing: false});
      }
    );
    // step 1: init audio state
    audio_controller.set_stream(streams.map[x.stream_id].url);
    audio_controller.set_volume(x.volume);
    audio_controller.set_state(x.playing);
    // step 2: bind storage-chaged handlers
    on_storage_change(function (ch) {
      if (ch.volume) {
        audio_controller.set_volume(ch.volume.newValue || 0.75);
      }
      if (ch.playing) {
        audio_controller.set_state(ch.playing.newValue || false);
      }
      if (ch.stream_id) {
        audio_controller.set_stream(streams.map[ch.stream_id.newValue || streams.def.stream].url);
      }
      if (ch.popup) {
        update_popup_mode(ch.popup.newValue || true);
      }
      if (ch.badge_background_color) {
        update_badge_color(ch.badge_background_color.newValue || '#942');
      }
    });
    // step 3: bind control button
    // (event fired only if popup not set)
    browser_action.onClicked.addListener(toggle_playing_state);
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
