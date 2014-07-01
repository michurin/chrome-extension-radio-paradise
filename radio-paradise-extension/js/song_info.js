/*
 * Radio Paradise player
 * Copyright (c) 2014 Alexey Michurin <a.michurin@gmail.com>
 * MIT License [http://www.opensource.org/licenses/mit-license.php]
 */

/*global window */
/*jslint
  indent:   2,
  vars:     true,
  plusplus: true
*/

'use strict';

(function () {

  var RP_INFO_URL = 'http://radioparadise.com/ajax_xml_song_info.php?song_id=now';

  function step_animation(e, th, step) {
    var ch = e.clientHeight;
    var nh = ch + step;
    if ((ch - th) * (th - nh) >= 0) {
      e.style.height = 'auto';
      e.style.overflow = 'visible';
      return;
    } else {
      e.style.height = nh + 'px';
    }
    setTimeout(function() {
      step_animation(e, th, step);
    }, 20);
  }

  function start_animation(e, ih, eh) {
    var d = eh - ih;
    var step;
    if (d < 0) {
      step = -4;
    } else if (d > 0) {
      step = 4;
    } else {
      return;
    }
    e.style.height = ih + 'px';
    e.style.overflow = 'hidden';
    step_animation(e, eh, step);
  }

  var prev_fingerprint = '';

  function display_song_info(info) {
    if (info.fingerprint !== prev_fingerprint) {
      var g, e = window.document.getElementById('song-info-text');
      var ih = e.clientHeight;
      e.innerText = '';
      [['artist', 'Artist'], ['title', 'Title'], ['album', 'Album']].forEach(
        function (v, n) {
          var x;
          var t = info[v[0]];
          if (t) {
            x = window.document.createElement('div');
            x.innerText += ' ' + v[1];
            x.className = 'song-info-title';
            e.appendChild(x);
            x = window.document.createElement('div');
            x.innerText += ' ' + t;
            x.className = 'song-info';
            e.appendChild(x);
          }
        }
      );
      var eh = e.clientHeight;
      start_animation(e, ih, eh);
      e = window.document.getElementById('song-image-keeper');
      if (info.med_cover) {
        g = window.document.createElement('img');
        g.onload = function () {
          var ih = e.clientHeight;
          e.innerText = '';
          e.appendChild(g);
          var eh = e.clientHeight;
          start_animation(e, ih, eh);
        };
        g.src = info.med_cover;
      } else {
        e.innerText = '';
      }
    }
    prev_fingerprint = info.fingerprint;
  }

  function parse_song_info(dom) {
    // dom can be null
    if (!dom) {
      return;
    }
    var fc = dom.firstChild;
    if (!fc) {
      return;
    }
    var info = {
      fingerprint: ''
    };
    ['artist', 'title', 'album', 'med_cover'].forEach(
      function (v, n) {
        var ee, e;
        ee = fc.getElementsByTagName(v);
        if (ee.length > 0) {
          e = ee[0];
        }
        if (e && typeof e.textContent === 'string') {
          info[v] = e.textContent;
          info.fingerprint += '::' + e.textContent;
        }
      }
    );
    return info;
  }

  function get_song_info() {
    var xhr = new window.XMLHttpRequest();
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        var info = parse_song_info(xhr.responseXML);
        if (info) {
          display_song_info(info);
        }
        setTimeout(get_song_info, 20000);
      }
    };
    xhr.onerror = function () {
      setTimeout(get_song_info, 5000);
    };
    xhr.open('GET', RP_INFO_URL, true);
    xhr.send();
  }

  get_song_info();

}());
