/*
 * Radio Paradise player
 * Copyright (c) 2014 Alexey Michurin <a.michurin@gmail.com>
 * MIT License [http://www.opensource.org/licenses/mit-license.php]
 */

/*global chrome */
/*global streams */
/*jslint
  indent:   2,
  vars:     true,
  plusplus: true,
  nomen:    true
*/

'use strict';

var storage = {
  get_all: function (f) {
    console.log('get...');
    chrome.storage.local.get(['volume', 'stream', 'play_state', 'control_mode'], function (a) {
      console.log('get:', a);
      f(
        a.volume || 75,
        streams.map[a.stream] ? a.stream : streams.def.stream,
        a.play_state === true,
        a.control_mode === 'one-click' ? 'one-click' : 'popup'
      );
    });
  },
  set_volume: function (volume) {
    storage.__runtime('update_volume', volume);
    chrome.storage.local.set({volume: volume});
  },
  set_stream: function (stream) {
    storage.__runtime('reset_media_source', stream);
    chrome.storage.local.set({stream: stream});
  },
  set_control_mode: function (mode) {
    chrome.storage.local.set({control_mode: mode});
    storage.__runtime('update_control_mode', mode);
  },
  toggle_playing_state: function () {
    chrome.storage.local.get('play_state', function (a) {
      var state = !a.play_state;
      storage.__runtime('play_pause', state);
      chrome.storage.local.set({play_state: state}, function () {
        if (storage.on.update_play_pause_element) {
          storage.on.update_play_pause_element(state);
        }
      });
    });
  },
  on: { // event handlers
    update_play_pause_element: null,
  },
  __runtime: function (name, params) {
    chrome.runtime.getBackgroundPage(function (w) {
      w[name](params);
    });
  }
};
