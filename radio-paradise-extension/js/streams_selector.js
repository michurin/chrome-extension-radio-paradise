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

'use strict';

(function () {

  var si = window.document.getElementById('stream-info');
  var ss = window.document.getElementById('stream-selectors');

  function radio_change(sid) {
    return function () {
      storage.set({stream_id: sid});
    };
  }

  streams.list.forEach(function (v) {
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
  });

}());
