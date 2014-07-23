/*
 * Radio Paradise player
 * Copyright (c) 2014 Alexey Michurin <a.michurin@gmail.com>
 * MIT License [http://www.opensource.org/licenses/mit-license.php]
 */

/*global window */
/*global storage, on_storage_change, streams */

'use strict';

(function () {

  function pupup_setter(v) {
    return function () {
      storage.set({popup: v});
    };
  }

  function stream_setter() {
    var vv = {};
    Array.prototype.slice.call(
      window.document.getElementById('streams-list').querySelectorAll('input:not(:checked)')
    ).forEach(function (v) {
      vv[v.id.substr(7)] = true; // cut off 'stream-'
    });
    storage.set({hidden_streams: vv});
  }

  function stream_activator(sid) {
    return function (event) {
      event.stopPropagation();
      event.preventDefault();
      storage.set({stream_id: sid}); // will be continued in on_storage_change handler
    };
  }

  function update_streams_list(sid) {
    var act = 'active-' + sid;
    Array.prototype.slice.call(
      window.document.querySelectorAll('#streams-list span')
    ).forEach(function (v) {
      if (v.id === act) {
        v.innerText = ' ★ ';
        v.title = 'current stream';
        v.className = '';
        v.onclick = undefined;
      } else {
        v.innerText = ' ☆ ';
        v.title = 'choose stream';
        v.className = 'cursor-pointer';
        v.onclick = stream_activator(v.id.substr(7)); // cut off 'active-'
      }
    });
  }

  function streams_list(state) { // state.hidden_streams, state.stream_id
    var fs = window.document.getElementById('streams-list');
    var hs = state.hidden_streams || streams.hidden_by_default;
    streams.list.forEach(function (v, n) {
      if (n > 0) {
        fs.appendChild(window.document.createElement('br'));
      }
      var eid = 'stream-' + v[0];
      var g, e = window.document.createElement('input');
      fs.appendChild(e);
      e.type = 'checkbox';
      e.id = eid;
      e.checked = !hs[v[0]];
      e.onchange = stream_setter;
      e = window.document.createElement('label');
      e.setAttribute('for', eid);
      g = window.document.createElement('b');
      g.innerText = ' ' + v[1].title;
      e.appendChild(g);
      g = window.document.createElement('span');
      g.id = 'active-' + v[0];
      e.appendChild(g);
      g = window.document.createElement('a');
      g.target = '_blank';
      g.innerText = v[1].url;
      g.href = v[1].url;
      e.appendChild(g);
      fs.appendChild(e);
    });
    update_streams_list(state.stream_id);
  }

  function update_volume(vol) {
    window.document.getElementById('volume-value').innerText = Math.round(vol * 100) + '%';
  }

  function volume_changer(dv) {
    return function () {
      storage.get({volume: 0.75}, function (x) {
        var v = x.volume;
        v += dv;
        v = Math.round(v * 10) / 10;
        v = v > 1 ? 1 : v;
        v = v < 0 ? 0 : v;
        storage.set({volume: v});
      });
    };
  }

  on_storage_change(function (ch) {
    if (ch.stream_id) {
      // can be changed by
      // - @here
      // - popup window
      update_streams_list(ch.stream_id.newValue);
    }
    if (ch.volume) {
      update_volume(ch.volume.newValue);
    }
  });

  function setup_animation(a) {
    var e = window.document.getElementById('animation');
    e.checked = a;
    e.onchange = function () {
      storage.set({animation: e.checked});
    };
  }

  storage.get({
    popup: true,
    stream_id: streams.def.stream,
    volume: 0.75,
    animation: true,
    hidden_streams: null // see comment in popup.js
  }, function (state) {
    // control mode
    window.document.getElementById(state.popup ? 'popup' : 'one-click').checked = true;
    Array.prototype.slice.call(
      window.document.querySelectorAll('input[name="control_mode"]')
    ).forEach(function (v) {
      v.disabled = false;
      v.onchange = pupup_setter(v.id === 'popup');
    });
    // volue controller
    update_volume(state.volume);
    window.document.getElementById('volume-plus').onclick = volume_changer(0.1);
    window.document.getElementById('volume-minus').onclick = volume_changer(-0.1);
    // animation
    setup_animation(state.animation);
    // streams
    streams_list(state);
  });

}());
