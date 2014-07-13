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

  function init_stream_selectors(hidden_streams) {

    var si = window.document.getElementById('stream-info');
    var ss = window.document.getElementById('stream-selectors');

    function radio_change(sid) {
      return function () {
        storage.set({stream_id: sid});
      };
    }

    streams.list.forEach(function (v) {
      if (hidden_streams[v[0]]) {
        return;
      }
      var d = window.document.createElement('div');
      var s = window.document.createElement('span');
      s.innerText = v[1].title;
      d.appendChild(s);
      si.appendChild(d);
      var e = window.document.createElement('input');
      e.type = 'radio';
      e.name = 'stream';
      e.id = v[0];
      e.onchange = radio_change(v[0]);
      ss.appendChild(e);
      e = window.document.createElement('label');
      e.setAttribute('for', v[0]);
      e.innerText = '●';
      e.onmouseover = function () {
        d.style.opacity = 0.8;
      };
      e.onmouseout = function () {
        d.style.opacity = 0;
      };
      ss.appendChild(e);
      ss.appendChild(window.document.createTextNode(' '));
    });

  }

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
    stream_id: streams.def.stream,
    hidden_streams: streams.hidden_by_default
  }, function (x) {
    update_play_pause_element(x.playing);
    volume_element.value = Math.round(x.volume * 100);
    volume_element.oninput = function () {
      storage.set({volume: this.value / 100});
    };
    volume_element.disabled = false;
    init_stream_selectors(x.hidden_streams);
    // element can be null if it hidden (by checkbox on options page)
    var e = window.document.getElementById(x.stream_id);
    if (e) {
      e.checked = true;
    }
  });

}());
