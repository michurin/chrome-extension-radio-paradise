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

  var i, v, e, root, j, tp, tps = ['ogg', 'mp3'];

  function radio_change(e) {
    return function () {
      storage.set({stream_id: e.id});
    };
  }

  for (j = 0; j < 2; j++) {
    tp = tps[j];
    root = window.document.getElementById('streams-selector-' + tp);
    for (i = 0; i < streams.list.length; ++i) {
      v = streams.list[i];
      if (v[1].type === tp) {
        e = window.document.createElement('input');
        e.type = 'radio';
        e.name = 'stream';
        e.id = v[0];
        e.onchange = radio_change(e);
        root.appendChild(e);
        e = window.document.createElement('label');
        e.setAttribute('for', v[0]);
        e.innerText = v[1].title;
        root.appendChild(e);
      }
    }
  }

  play_pause_element.onclick = function (event) {
    event.preventDefault();
    toggle_playing_state();
  };

  function update_play_pause_element(state) {
    play_pause_element.className = state ? 'play-on' : 'play-off';
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
