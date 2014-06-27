/*
 * Radio Paradise player
 * Copyright (c) 2014 Alexey Michurin <a.michurin@gmail.com>
 * MIT License [http://www.opensource.org/licenses/mit-license.php]
 */

/*global window, chrome */
/*global streams, storage */
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
      storage.set_stream(e.id);
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

  storage.on.update_play_pause_element = function (state) {
    play_pause_element.className = state ? 'play-on' : 'play-off';
  };

  storage.get_all(function (vol, stream, state) {
    console.log(vol, stream, state);
    volume_element.value = vol;
    volume_element.disabled = false;
    volume_element.oninput = function () {
      storage.set_volume(this.value);
    };
    window.document.getElementById(stream).checked = true;
    storage.on.update_play_pause_element(state);
    play_pause_element.onclick = function (event) {
      event.preventDefault();
      console.log('onclick');
      storage.toggle_playing_state();
    };
  });

}());
