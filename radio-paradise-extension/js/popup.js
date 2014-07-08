/*
 * Radio Paradise player
 * Copyright (c) 2014 Alexey Michurin <a.michurin@gmail.com>
 * MIT License [http://www.opensource.org/licenses/mit-license.php]
 */

/*global window, chrome */
/*global streams, storage, toggle_playing_state, on_storage_change */
/*jslint
  indent:   2,
  vars:     true,
  plusplus: true
*/

'use strict';

(function () {

  var volume_element = window.document.querySelector('input[name="volume"]');
  var play_pause_element = window.document.getElementById('play-pause-button');

  play_pause_element.onclick = function (event) {
    event.preventDefault();
    toggle_playing_state();
  };

  function update_play_pause_element(state) {
    play_pause_element.src = 'images/' + (state ? 'play-off' : 'play-on') + '.svg';
  }

  on_storage_change(function (ch) {
    if (ch.playing) {
      // can be changed by
      // - @here
      // - watchdog in background page
      update_play_pause_element(ch.playing.newValue);
    }
  });

  storage.get({
    playing: false,
    volume: 0.75,
    stream_id: streams.def.stream
  }, function (x) {
    update_play_pause_element(x.playing);
    volume_element.value = Math.round(x.volume * 100);
    volume_element.oninput = function () {
      storage.set({volume: this.value / 100});
    };
    volume_element.disabled = false;
    window.document.getElementById(x.stream_id).checked = true;
  });

}());
