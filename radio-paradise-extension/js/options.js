/*
 * Radio Paradise player
 * Copyright (c) 2014 Alexey Michurin <a.michurin@gmail.com>
 * MIT License [http://www.opensource.org/licenses/mit-license.php]
 */

/*global window */
/*global storage, streams */
/*jslint
  indent:   2,
  vars:     true,
  plusplus: true
*/

"use strict";

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

  storage.get({
    popup: true,
    stream_id: streams.def.stream,
    hidden_streams: {}
  }, function (x) {
    // control mode
    window.document.getElementById(x.popup ? 'popup' : 'one-click').checked = true;
    Array.prototype.slice.call(
      window.document.querySelectorAll('input[name="control_mode"]')
    ).forEach(function (v, n) {
      v.disabled = false;
      v.onchange = pupup_setter(v.id === 'popup');
    });
    // streams
    var fs = window.document.getElementById('streams-list');
    streams.list.forEach(function (v, n) {
      if (n > 0) {
        fs.appendChild(window.document.createElement('br'));
      }
      var eid = 'stream-' + v[0];
      var g, e = window.document.createElement('input');
      fs.appendChild(e);
      e.type = 'checkbox';
      e.id = eid;
      e.checked = !x.hidden_streams[v[0]];
      e.onchange = stream_setter(eid);
      e = window.document.createElement('label');
      e.setAttribute('for', eid);
      g = window.document.createElement('b');
      g.innerText = ' ' + v[1].title + ' ';
      e.appendChild(g);
      if (v[0] === x.stream_id) {
        g = window.document.createElement('cpan');
        g.innerText = '(current) ';
        e.appendChild(g);
      }
      g = window.document.createElement('a');
      g.innerText = v[1].url;
      g.href = v[1].url;
      e.appendChild(g);
      fs.appendChild(e);
    });
  });

}());
