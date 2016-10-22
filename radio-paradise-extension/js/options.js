/*
 * Radio Paradise player
 * Copyright (c) 2014-2016 Alexey Michurin <a.michurin@gmail.com>
 * MIT License [http://www.opensource.org/licenses/mit-license.php]
 */

/*global storage, streams, volume_change, $ */

'use strict';

(function () {

  var stream_list = $.id('streams-list');
  var badge_color = $.id('badge-background-color');

  function pupup_setter(v) {
    return function () {
      storage.set({popup: v});
    };
  }

  function stream_setter() {
    var vv = {};
    $.each(stream_list, 'input:not(:checked)', function (v) {
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
      }); // will be continued in storage.onchange handler
    };
  }

  function update_stream_id_in_streams_list(sid) {
    var act = 'active-' + sid;
    $.each(stream_list, 'span', function (v) {
      if (v.id === act) {
        v.innerText = '★';
        v.title = 'current stream';
        v.className = 'stream-star';
        v.onclick = undefined;
      } else {
        v.innerText = '☆';
        v.title = 'choose stream';
        v.className = 'stream-star cursor-pointer';
        v.onclick = stream_activator(v.id.substr(7)); // cut off 'active-'
      }
    });
  }

  function update_active_streams_in_streams_list(hs) {
    $.each(stream_list, 'input', function (v) {
      v.checked = !hs[v.id.substr(7)]; // cut off 'active-'
    });
  }

  function streams_list(state) { // state.hidden_streams, state.stream_id
    streams.list.forEach(function (v) {
      var eid = 'stream-' + v[0];
      var f = $.create('label');
      f.setAttribute('for', eid);
      var e = $.create('input');
      e.type = 'checkbox';
      e.id = eid;
      e.onchange = stream_setter;
      f.appendChild(e);
      f.appendChild($.tx());
      e = $.create('b');
      e.innerText = v[1].title;
      f.appendChild(e);
      f.appendChild($.tx());
      e = $.create('span');
      e.id = 'active-' + v[0];
      f.appendChild(e);
      f.appendChild($.tx());
      e = $.create('a');
      e.target = '_blank';
      e.innerText = v[1].url;
      e.href = v[1].url;
      f.appendChild(e);
      stream_list.appendChild(f);
    });
    update_stream_id_in_streams_list(state.stream_id);
    update_active_streams_in_streams_list(state.hidden_streams);
  }

  function update_volume(vol) {
    $.id('volume-value').innerText = Math.round(vol * 100) + '%';
  }

  function volume_changer(levels) {
    return function () {
      volume_change(levels);
    };
  }

  function make_badge_background_controls(color) {
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
      name: 'gold',
      up: '#fea',
      down: '#ca5',
      color: '#fc7'
    }, {
      name: 'dark',
      up: '#777',
      down: '#444',
      color: '#222'
    }, {
      name: 'middle',
      up: '#aaa',
      down: '#777',
      color: '#888'
    }, {
      name: 'light',
      up: '#fff',
      down: '#ccc',
      color: '#eee'
    }];
    var elements = [];
    colors.forEach(function (v) {
      var x = $.create('span');
      x.className = 'color-selector';
      x.style.backgroundImage = 'linear-gradient(#fff, #ddd, ' + v.up + ', ' + v.down +')';
      x.innerText = v.name;
      x.dataset.color = v.color;
      x.onclick = function() {
        // here we fire storage event; UI changes in handler
        storage.set({
          badge_background_color: v.color
        });
      };
      if (v.color === color) {
        x.classList.add('color-selected');
      }
      elements.push(x);
      badge_color.appendChild(x);
    });
  }

  function setup_animation(a) {
    var e = $.id('animation');
    e.checked = a;
    e.onchange = function () {
      storage.set({animation: e.checked});
    };
  }

  storage.onchange({
    stream_id: update_stream_id_in_streams_list,
    volume: update_volume,
    popup: function (x) {
      $.id(x ? 'popup' : 'one-click').checked = true;
    },
    badge_background_color: function (x) {
      $.each(badge_color, '.color-selector', function (v) {
        if (v.dataset.color === x) {
          v.classList.add('color-selected');
        } else {
          v.classList.remove('color-selected');
        }
      });
    },
    animation: setup_animation,
    hidden_streams: update_active_streams_in_streams_list
  });

  storage.get([
    'popup',
    'stream_id',
    'volume',
    'animation',
    'badge_background_color',
    'hidden_streams'
  ], function (state) {
    // control mode
    $.id(state.popup ? 'popup' : 'one-click').checked = true;
    $.each($.id('mode-control'), 'input[name="control_mode"]', function (v) {
      v.disabled = false;
      v.onchange = pupup_setter(v.id === 'popup');
    });
    // volue controller
    update_volume(state.volume);
    $.id('volume-plus').onclick = volume_changer(10);
    $.id('volume-minus').onclick = volume_changer(-10);
    // animation
    setup_animation(state.animation);
    // streams
    streams_list(state);
    // badge
    make_badge_background_controls(state.badge_background_color);
  });

}());
