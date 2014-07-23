/*
 * Radio Paradise player
 * Copyright (c) 2014 Alexey Michurin <a.michurin@gmail.com>
 * MIT License [http://www.opensource.org/licenses/mit-license.php]
 */

/*global chrome */
/*exported storage, toggle_playing_state, on_storage_change, update_field */

'use strict';

var storage = chrome.storage.local;

function toggle_playing_state() {
  storage.get({playing: false}, function (x) {
    storage.set({playing: !x.playing});
  });
}

function on_storage_change(f) {
  chrome.storage.onChanged.addListener(function (ch, area) {
    if (area === 'local') {
      f(ch);
    }
  });
}

function update_field(name) {
  var p = {};
  p[name] = (new Date()).toUTCString();
  storage.set(p);
}
