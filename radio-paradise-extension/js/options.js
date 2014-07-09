/*
 * Radio Paradise player
 * Copyright (c) 2014 Alexey Michurin <a.michurin@gmail.com>
 * MIT License [http://www.opensource.org/licenses/mit-license.php]
 */

/*global window */
/*global storage, on_storage_change, streams */
/*jslint
  indent:   2,
  vars:     true,
  plusplus: true
*/

'use strict';

(function () {

  function pupup_setter(v) {
    return function () {
      storage.set({popup: v});
    };
  }

  function stream_setter(v) {
    return function () {
      var vv = {};
      Array.prototype.slice.call(
        window.document.getElementById('streams-list').querySelectorAll('input:not(:checked)')
      ).forEach(function (v, n) {
        vv[v.id.substr(7)] = true; // cut off 'stream-'
      });
      storage.set({hidden_streams: vv});
    };
  }

  function stream_activator(sid) {
    return function (event) {
      event.stopPropagation();
      event.preventDefault();
      storage.set({stream_id: sid}); // will be continued in on_storage_change handler
    };
  }

  function streams_list(state) { // state.hidden_streams, state.stream_id
    var fs = window.document.getElementById('streams-list');
    fs.innerText = '';
    streams.list.forEach(function (v, n) {
      if (n > 0) {
        fs.appendChild(window.document.createElement('br'));
      }
      var eid = 'stream-' + v[0];
      var g, e = window.document.createElement('input');
      fs.appendChild(e);
      e.type = 'checkbox';
      e.id = eid;
      e.checked = !state.hidden_streams[v[0]];
      e.onchange = stream_setter(eid);
      e = window.document.createElement('label');
      e.setAttribute('for', eid);
      g = window.document.createElement('b');
      g.innerText = ' ' + v[1].title + ' ';
      e.appendChild(g);
      g = window.document.createElement('cpan');
      if (v[0] === state.stream_id) {
        g.innerText = '(current) ';
      } else {
        g.innerText = '► ';
        g.className = 'cursor-pointer';
        g.onclick = stream_activator(v[0]);
      }
      e.appendChild(g);
      g = window.document.createElement('a');
      g.target = '_blank';
      g.innerText = v[1].url;
      g.href = v[1].url;
      e.appendChild(g);
      fs.appendChild(e);
    });
  }

  on_storage_change(function (ch) {
    if (ch.stream_id) {
      // can be changed by
      // - @here
      // - popup window
      storage.get({
        stream_id: streams.def.stream,
        hidden_streams: {}
      }, streams_list);
    }
  });

  storage.get({
    popup: true,
    stream_id: streams.def.stream,
    hidden_streams: {}
  }, function (state) {
    // control mode
    window.document.getElementById(state.popup ? 'popup' : 'one-click').checked = true;
    Array.prototype.slice.call(
      window.document.querySelectorAll('input[name="control_mode"]')
    ).forEach(function (v, n) {
      v.disabled = false;
      v.onchange = pupup_setter(v.id === 'popup');
    });
    // streams
    streams_list(state);
  });

}());
