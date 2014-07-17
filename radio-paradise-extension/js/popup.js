/*
 * Radio Paradise player
 * Copyright (c) 2014 Alexey Michurin <a.michurin@gmail.com>
 * MIT License [http://www.opensource.org/licenses/mit-license.php]
 */

/*global window, chrome */
/*global streams, storage, toggle_playing_state, on_storage_change, image_info_init */
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
        Array.prototype.slice.call(
          ss.querySelectorAll('img')
        ).forEach(function (e) {
          console.log(e, e.id, sid);
        });
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
      var e = window.document.createElement('img');
      e.className = 'stream-select-point';
      e.src = 'images/stream-off.svg';
      e.onmouseover = function () {
        d.style.opacity = 0.8;
      };
      e.onmouseout = function () {
        d.style.opacity = 0;
      };
      e.onclick = radio_change(v[0]);
      e.id = v[0];
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
    play_pause_element.src = 'images/play-' + (state ? 'off' : 'on') + '.svg';
  }

  function update_selectors(sid) {
    Array.prototype.slice.call(
      window.document.querySelectorAll('#stream-selectors img')
    ).forEach(function (e) {
      e.src = 'images/stream-' + (e.id === sid ? 'on' : 'off') + '.svg';
      console.log(e, e.id, sid, e.src);
    });
  }

  on_storage_change(function (ch) {
    if (ch.playing) {
      // can be changed by
      // - @here
      // - watchdog in background page
      update_play_pause_element(ch.playing.newValue);
    }
    if (ch.stream_id) {
      update_selectors(ch.stream_id.newValue);
    }
  });

  storage.get({
    playing: false,
    volume: 0.75,
    stream_id: streams.def.stream,
    animation: true,
    hidden_streams: null // we must NOT use object as default because chrome merge default and actual objects
  }, function (x) {
    update_play_pause_element(x.playing);
    volume_element.value = Math.round(x.volume * 100);
    volume_element.oninput = function () {
      storage.set({volume: this.value / 100});
    };
    volume_element.disabled = false;
    init_stream_selectors(x.hidden_streams || streams.hidden_by_default);
    update_selectors(x.stream_id);
    var not_animate = !x.animation;
    window.dom_keeper.get_all(function (cache) {
      image_info_init(cache, not_animate);
    });
  });

}());
