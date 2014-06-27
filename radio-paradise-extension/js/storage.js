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
  plusplus: true
*/

'use strict';

var storage = {
  get_all: function (f) {
    console.log('get...');
    chrome.storage.local.get(['volume', 'stream', 'play_state'], function (a) {
      console.log('get:', a);
      f(
        a.volume || 75,
        streams.map[a.stream] ? a.stream : streams.def.stream,
        a.play_state === true
      );
    });
  },
  set_volume: function (volume) {
    chrome.storage.local.set({volume: volume}, function (a) {
      storage.__runtime('update_volume', volume);
    });
  },
  set_stream: function (stream) {
    chrome.storage.local.set({stream: stream}, function (a) {
    });
  },
  toggle_playing_state: function () {
    chrome.storage.local.get('play_state', function (a) {
      var state = !a.play_state;
      storage.__runtime('play_pause', state);
      chrome.storage.local.set({play_state: state}, function () {
        storage.on.update_play_pause_element(state);
      });
    });
  },
  on: { // event handlers
    update_play_pause_element: null,
  },
  __runtime: function(name, params) {
    chrome.runtime.getBackgroundPage(function (w) {
      w[name](params);
    });
  }
};
