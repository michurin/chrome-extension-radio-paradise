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
  var ERROR_IMAGE_URL = 'images/0.jpg';

  var prev_fingerprint = '';

  var song_info_element = window.document.getElementById('song-info-text');
  var song_info_element_wrapper = window.document.getElementById('song-info-text-wrapper');

  var animator_of_textbox = window.animator_generator(function (v) {
    song_info_element.style.height = Math.round(v) + 'px';
  }, function () {
    song_info_element.style.overflow = 'visible';
    song_info_element.style.height = 'auto';
  });

  var song_image_element = window.document.getElementById('song-image-keeper');
  var song_image_element_wrapper = window.document.getElementById('song-image-border');

  var animator_of_imagebox = window.animator_generator(function (v) {
    song_image_element.style.height = Math.round(v) + 'px';
  }, function () {
    song_image_element.style.overflow = 'visible';
    song_image_element.style.height = 'auto';
  });

  function seq(a, b) {
    var f, x, m, i, s = [], J = 20;
    m = b - a;
    for (i = 0; i <= J; ++i) {
      // like f = Math.sin(i/J * Math.PI/2) but better
      x = i / J - 2;
      f = (4 - x * x) / 3; // 0..1
      s.push(a + m * f);
    }
    return s;
  }

  function lock_size(e) {
    e.style.overflowY = 'hidden';
    e.style.height = e.clientHeight + 'px';
  }

  function unlock_size(e) {
    e.style.overflowY = 'visible';
    e.style.height = 'auto';
  }

  function display_song_info(info) {
    if (info.fingerprint !== prev_fingerprint) {
      // prepare text
      lock_size(song_info_element_wrapper); // lock wraper
      // render new content
      var ih = song_info_element.clientHeight;
      song_info_element.style.overflow = 'visible';
      song_info_element.style.height = 'auto';
      // clean
      song_info_element.innerText = '';
      // fill
      [['artist', 'Artist'], ['title', 'Title'], ['album', 'Album']].forEach(
        function (v, n) {
          var x;
          var t = info[v[0]];
          if (t) {
            x = window.document.createElement('div');
            x.innerText = '• ' + v[1] + ' •';
            x.className = 'song-info-title';
            song_info_element.appendChild(x);
            x = window.document.createElement('div');
            x.innerText = t;
            x.className = 'song-info';
            song_info_element.appendChild(x);
          }
        }
      );
      var fh = song_info_element.clientHeight;
      // prepare to animate
      song_info_element.style.overflow = 'hidden';
      song_info_element.style.height = ih + 'px';
      unlock_size(song_info_element_wrapper);
      animator_of_textbox(seq(ih, fh)); // start animation
      // prepare image
      var url = ERROR_IMAGE_URL;
      if (info.med_cover) {
        url = info.med_cover;
      }
      var g = window.document.createElement('img');
      g.onload = function () {
        var ih = song_image_element.clientHeight;
        lock_size(song_image_element_wrapper);
        song_image_element.innerText = '';
        song_image_element.appendChild(g);
        var fh = song_image_element.clientHeight;
        song_image_element.style.overflow = 'hidden';
        song_image_element.style.height = ih + 'px';
        unlock_size(song_image_element_wrapper);
        animator_of_imagebox(seq(ih, fh)); // start animation
      };
      g.onerror = function () {
        g.src = ERROR_IMAGE_URL;
      };
      g.src = url;
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
        window.setTimeout(get_song_info, 20000);
      }
    };
    xhr.onerror = function () {
      window.setTimeout(get_song_info, 5000);
    };
    xhr.open('GET', RP_INFO_URL, true);
    xhr.send();
  }

  get_song_info();

}());
