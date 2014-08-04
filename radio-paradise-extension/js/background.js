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
    // mode === undefined is true
    browser_action.setPopup({
      popup: (mode === undefined || mode) ? 'popup.html' : ''
    });
  }

  function update_badge_color(color) {
    browser_action.setBadgeBackgroundColor({color: color || '#942'});
  }

  function badge_updater(text) {
    return function () {
      browser_action.setBadgeText({text: text});
    };
  }

  function init_audio() {
    // we *MUST* init audio params every time page loaded
    // i.e. on every event that raise event page
    storage.get({
      volume: 0.75,
      playing: false,
      stream_id: streams.def.stream
    }, function (x) {
      update_field('last_init_audio');
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
          update_popup_mode(ch.popup.newValue);
        }
        if (ch.badge_background_color) {
          update_badge_color(ch.badge_background_color.newValue);
        }
      });
      // step 3: set onclick; fired only if popup === ''
      browser_action.onClicked.addListener(toggle_playing_state);
    });
  }

  function init() {
    // part of initialisation, that have not to do
    // every time page loaded
    storage.get(['popup', 'badge_background_color'], function (x) {
      storage.set({last_init_args: x});
      update_popup_mode(x.popup);
      update_badge_color(x.badge_background_color);
    });
  }

  chrome.runtime.onStartup.addListener(function () {
    // not fired on installed
    update_field('last_startup');
    init();
  });
  chrome.runtime.onInstalled.addListener(function () {
    update_field('last_install');
    init();
  });
  chrome.runtime.onUpdateAvailable.addListener(function () {
    // reload if update available, but isn't installed immediately
    // because the background page is currently running
    chrome.runtime.reload();
  });

  // it seems, we can not make initialisation event driven completely
  // cose audio_controller is not ready to run in half-init state
  init_audio();

}());
