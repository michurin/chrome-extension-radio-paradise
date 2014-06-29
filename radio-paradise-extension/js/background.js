/*
 * Radio Paradise player
 * Copyright (c) 2014 Alexey Michurin <a.michurin@gmail.com>
 * MIT License [http://www.opensource.org/licenses/mit-license.php]
 */

/*global window, chrome */
/*global streams, storage, audio_controller */
/*jslint
  indent:   2,
  vars:     true,
  plusplus: true
*/

'use strict';

(function () {

  var browser_action = chrome.browserAction;

  function init() {
    browser_action.setBadgeBackgroundColor({color: '#942'});
    storage.get_all(function (vol, stream, state, mode) {
      audio_controller.set_stream(streams.map[stream].url);
      audio_controller.set_volume(vol / 100);
      audio_controller.set_state(state);
      window.update_control_mode(mode);
    });
  }

  // bindings

  function badge_updater(text) {
    return function () {
      browser_action.setBadgeText({text: text});
    };
  }

  browser_action.onClicked.addListener(storage.toggle_playing_state); // fired only if popup not set
  chrome.runtime.onStartup.addListener(init); // not fired on installed
  chrome.runtime.onInstalled.addListener(init);
  audio_controller.set_callbacks(
    badge_updater('…'),
    badge_updater('\u25ba'),
    badge_updater('')
  );

  // publick

  window.play_pause = audio_controller.set_state;

  window.update_volume = function (vol) {
    audio_controller.set_volume(vol / 100);
  };

  window.reset_media_source = function (stream) {
    audio_controller.set_stream(streams.map[stream].url);
  };

  window.update_control_mode = function (mode) {
    console.log('BG', mode);
    browser_action.setPopup({
      popup: mode === 'popup' ? 'popup.html' : ''
    });
  };

}());
