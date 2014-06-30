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
