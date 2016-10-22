/*
 * Radio Paradise player
 * Copyright (c) 2014-2016 Alexey Michurin <a.michurin@gmail.com>
 * MIT License [http://www.opensource.org/licenses/mit-license.php]
 */

/*global window */
/*global streams, storage, $ */
/*global image_info_init, volume_change */

'use strict';

(function () {

  var si = $.id('stream-info');
  var ss = $.id('stream-selectors');
  var pe = $.id('stream-point');

  function select_stream(sid) {
    return function () {
      storage.set({stream_id: sid});
    };
  }

  function select_stream_ctl(iid, title) {
    var d = $.create('div');
    var s = $.create('span');
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
    ss.appendChild($.tx());
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

  var volume_element = $.id('volume-control');
  var volume_element_is_active = false;

  volume_element.onmousedown = function (e) {
    volume_element_is_active = true;
    $.body.onmousemove(e);
  };

  $.body.onmouseup = $.body.onmouseleave = function () {
    volume_element_is_active = false;
  };

  $.body.onmousemove = function (e) {
    if (volume_element_is_active) {
      var p = volume_element.getBoundingClientRect();
      var v = e.clientX - p.left - 6;
      v = (v < 0 ? 0 : v > 138 ? 138 : v) / 138;
      storage.set({volume: v});
    }
  };

  $.body.onkeydown = function (e) {
    switch (e.which) {
      case 32:
      case 13:
        storage.toggle_playing_state();
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

  var play_pause_element = $.id('play-pause-button');

  play_pause_element.onclick = function (e) {
    e.preventDefault();
    storage.toggle_playing_state();
  };

  function update_play_pause_element(state) {
    // className do not works in chrome 35-36
    play_pause_element.setAttribute('class', 'container-' + (state ? 'on' : 'off'));
  }

  function update_selectors(sid) {
    $.each(ss, 'svg', function (e) {
      e.setAttribute('class', 'container-' + (e.id === sid ? 'on' : 'off'));
    });
  }

  function update_volume_element(volume) {
    volume_element.getElementsByTagName('circle')[0].setAttribute('cx', volume * 1380 + 60);
  }

  storage.onchange({
    // can be changed by
    // - @here
    // - watchdog in background page
    // - alarms
    playing: update_play_pause_element,
    stream_id: update_selectors,
    volume: update_volume_element
  });

  storage.get([
    'playing',
    'volume',
    'stream_id',
    'animation',
    'hidden_streams',
    'custom_streams',
    'hidden_custom_streams'
  ], function (x) {
    update_play_pause_element(x.playing);
    update_volume_element(x.volume);
    volume_element.setAttribute('class', 'container-on');
    init_stream_selectors(x.hidden_streams);
    init_custom_streams_selectors(x.custom_streams, x.hidden_custom_streams);
    update_selectors(x.stream_id);
    var not_animate = !x.animation;
    window.dom_keeper.get_all(function (cache) {
      image_info_init(cache, not_animate);
    });
  });

}());
