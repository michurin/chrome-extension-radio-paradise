/*
 * Radio Paradise player
 * Copyright (c) 2014 Alexey Michurin <a.michurin@gmail.com>
 * MIT License [http://www.opensource.org/licenses/mit-license.php]
 */

/*global window */
/*global streams, storage, toggle_playing_state, on_storage_change */
/*global image_info_init, volume_change */

'use strict';

(function () {

  var si = window.document.getElementById('stream-info');
  var ss = window.document.getElementById('stream-selectors');
  var pe = window.document.getElementById('stream-point');

  function select_stream(sid) {
    return function () {
      storage.set({stream_id: sid});
    };
  }

  function select_stream_ctl(iid, title) {
    var d = window.document.createElement('div');
    var s = window.document.createElement('span');
    s.innerText = title;
    d.appendChild(s);
    si.appendChild(d);
    var e = pe.cloneNode(true);
    e.onmouseover = function () {
      d.style.opacity = 0.85;
    };
    e.onmouseout = function () {
      d.style.opacity = 0;
    };
    e.onclick = select_stream(iid);
    e.id = iid;
    ss.appendChild(e);
    ss.appendChild(window.document.createTextNode(' '));
  }

  function init_stream_selectors(hidden_streams) {
    streams.list.forEach(function (v) {
      if (hidden_streams[v[0]]) {
        return;
      }
      select_stream_ctl(v[0], v[1].title);
    });
  }

  function init_custom_streams_selectors(custom_streams, hidden) {
    custom_streams.forEach(function (v) {
      if (! hidden[v[0]]) {
        select_stream_ctl(v[0], v[1].title);
      }
    });
  }

  var volume_element = window.document.getElementById('volume-control');
  var volume_element_is_active = false;

  volume_element.onmousedown = function (e) {
    volume_element_is_active = true;
    window.document.body.onmousemove(e);
  };

  window.document.body.onmouseup = window.document.body.onmouseleave = function () {
    volume_element_is_active = false;
  };

  window.document.body.onmousemove = function (e) {
    if (volume_element_is_active) {
      var p = volume_element.getBoundingClientRect();
      var v = e.clientX - p.left - 6;
      v = (v < 0 ? 0 : v > 138 ? 138 : v) / 138;
      storage.set({volume: v});
    }
  };

  window.document.body.onkeydown = function (e) {
    switch (e.which) {
      case 32:
      case 13:
        toggle_playing_state();
        break;
      case 37:
      case 40:
        volume_change(-20);
        break;
      case 39:
      case 38:
        volume_change(20);
        break;
      default:
        return;
    }
    e.preventDefault();
  };

  var play_pause_element = window.document.getElementById('play-pause-button');

  play_pause_element.onclick = function (e) {
    e.preventDefault();
    toggle_playing_state();
  };

  function update_play_pause_element(state) {
    // className do not works in chrome 35-36
    play_pause_element.setAttribute('class', 'container-' + (state ? 'on' : 'off'));
  }

  function update_selectors(sid) {
    Array.prototype.slice.call(
      window.document.querySelectorAll('#stream-selectors svg'),
      0
    ).forEach(function (e) {
      e.setAttribute('class', 'container-' + (e.id === sid ? 'on' : 'off'));
    });
  }

  function update_volume_element(volume) {
    if (typeof volume !== 'number') {
      volume = 0.75;
    }
    volume_element.getElementsByTagName('circle')[0].setAttribute('cx', volume * 1380 + 60);
  }

  on_storage_change(function (ch) {
    if (ch.playing) {
      // can be changed by
      // - @here
      // - watchdog in background page
      // - alarms
      update_play_pause_element(ch.playing.newValue || false);
    }
    if (ch.stream_id) {
      update_selectors(ch.stream_id.newValue || streams.def.stream);
    }
    if (ch.volume) {
      update_volume_element(ch.volume.newValue);
    }
  });

  storage.get({
    playing: false,
    volume: 0.75,
    stream_id: streams.def.stream,
    animation: true,
    hidden_streams: null, // we must NOT use object as default because chrome merge default and actual objects
    custom_streams: null,
    hidden_custom_streams: null
  }, function (x) {
    update_play_pause_element(x.playing);
    update_volume_element(x.volume);
    volume_element.setAttribute('class', 'container-on');
    init_stream_selectors(x.hidden_streams || streams.hidden_by_default);
    init_custom_streams_selectors(x.custom_streams || [], x.hidden_custom_streams || {});
    update_selectors(x.stream_id);
    var not_animate = !x.animation;
    window.dom_keeper.get_all(function (cache) {
      image_info_init(cache, not_animate);
    });
  });

}());
