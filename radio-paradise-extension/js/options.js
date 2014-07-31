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
      window.document.getElementById('streams-list').querySelectorAll('input:not(:checked)'),
      0
    ).forEach(function (v) {
      vv[v.id.substr(7)] = true; // cut off 'stream-'
    });
    storage.set({hidden_streams: vv});
  }

  function stream_activator(sid) {
    return function (event) {
      event.stopPropagation();
      event.preventDefault();
      storage.set({
        stream_id: sid
      }); // will be continued in on_storage_change handler
    };
  }

  function update_streams_list(sid) {
    var act = 'active-' + sid;
    Array.prototype.slice.call(
      window.document.querySelectorAll('#streams-list span'),
      0
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
    streams.list.forEach(function (v) {
      var eid = 'stream-' + v[0];
      var f = window.document.createElement('label');
      f.setAttribute('for', eid);
      var e = window.document.createElement('input');
      e.type = 'checkbox';
      e.id = eid;
      e.checked = !hs[v[0]];
      e.onchange = stream_setter;
      f.appendChild(e);
      e = window.document.createElement('b');
      e.innerText = ' ' + v[1].title;
      f.appendChild(e);
      e = window.document.createElement('span');
      e.id = 'active-' + v[0];
      f.appendChild(e);
      e = window.document.createElement('a');
      e.target = '_blank';
      e.innerText = v[1].url;
      e.href = v[1].url;
      f.appendChild(e);
      fs.appendChild(f);
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

  function make_badge_background_controls(color) {
    var root = window.document.getElementById('badge-background-color');
    var colors = [{
      name: 'red',
      up: '#f88',
      down: '#c00',
      color: '#f00'
    }, {
      name: 'orange',
      up: '#fd8',
      down: '#c70',
      color: '#f80'
    }, {
      name: 'yellow',
      up: '#ff8',
      down: '#cc0',
      color: '#ff0'
    }, {
      name: 'green',
      up: '#8f8',
      down: '#0c0',
      color: '#0c0'
    }, {
      name: 'blue',
      up: '#88f',
      down: '#44f',
      color: '#44f'
    }, {
      name: 'indigo',
      up: '#d8f',
      down: '#70f',
      color: '#80f'
    }, {
      name: 'violet',
      up: '#f8f',
      down: '#c0c',
      color: '#f0f'
    }, {
      name: 'classic',
      up: '#a64',
      down: '#721',
      color: '#942'
    }, {
      name: 'dark',
      up: '#777',
      down: '#444',
      color: '#222'
    }, {
      name: 'light',
      up: '#fff',
      down: '#ccc',
      color: '#eee'
    }];
    var elements = [];
    colors.forEach(function (v) {
      var x = window.document.createElement('span');
      x.className = 'color-selector';
      x.style.backgroundImage = 'linear-gradient(#fff, #ddd, ' + v.up + ', ' + v.down +')';
      x.innerText = v.name;
      // the true way is to change here storage state *only*
      // and change view of elements on storage changeged
      // in event handler; but life is not perfect
      x.onclick = function() {
        storage.set({
          badge_background_color: v.color
        });
        elements.forEach(function (v) {
          v.classList.remove('color-selected');
        });
        x.classList.add('color-selected');
      };
      if (v.color === color) {
        x.classList.add('color-selected');
      }
      elements.push(x);
      root.appendChild(x);
    });
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
    badge_background_color: '#942',
    hidden_streams: null // see comment in popup.js
  }, function (state) {
    // control mode
    window.document.getElementById(state.popup ? 'popup' : 'one-click').checked = true;
    Array.prototype.slice.call(
      window.document.querySelectorAll('input[name="control_mode"]'),
      0
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
    // badge
    make_badge_background_controls(state.badge_background_color);
  });

}());
