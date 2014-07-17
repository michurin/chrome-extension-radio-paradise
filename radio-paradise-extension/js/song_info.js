/*
 * Radio Paradise player
 * Copyright (c) 2014 Alexey Michurin <a.michurin@gmail.com>
 * MIT License [http://www.opensource.org/licenses/mit-license.php]
 */

/*global window */
/*global height_animator_generator, open_url_in_new_tab */
/*jslint
  indent:   2,
  vars:     true,
  plusplus: true
*/

'use strict';

var image_info_init = (function () {

  var RP_INFO_URL = 'http://radioparadise.com/ajax_xml_song_info.php?song_id=now';
  var RP_SONGINFO_BASE = 'http://www.radioparadise.com/rp2p-content.php?name=Music&file=songinfo&song_id=';
  var ERROR_IMAGE_URL = 'images/0.jpg';

  var prev_fingerprint = '';

  var not_animate = false;

  var text_box_animator = height_animator_generator(
    window.document.getElementById('song-info-text'),
    window.document.getElementById('song-info-text-wrapper')
  );
  var image_box_animator = height_animator_generator(
    window.document.getElementById('song-info-image'),
    window.document.getElementById('song-info-image-wrapper')
  );

  function save_childs(k, e) {
    window.dom_keeper.set(k, e.map(function (x) {
      return x.cloneNode(true);
    }));
  }

  function display_song_info(info) {
    if (info.fingerprint !== prev_fingerprint) {
      // prepare onclick
      var songid = info.songid;
      if (songid) {
        var e = window.document.getElementById('song-info');
        e.style.cursor = 'pointer';
        e.onclick = (function (url) {
          return function () {
            open_url_in_new_tab(url);
          };
        }(RP_SONGINFO_BASE + songid));
      }
      // prepare text
      var content = [];
      [['artist', 'Artist'], ['title', 'Title'], ['album', 'Album']].forEach(
        function (v) {
          var x;
          var t = info[v[0]];
          if (t) {
            x = window.document.createElement('div');
            x.innerText = '• ' + v[1] + ' •';
            x.className = 'song-info-title';
            content.push(x);
            x = window.document.createElement('div');
            x.innerText = t;
            x.className = 'song-info';
            content.push(x);
          }
        }
      );
      text_box_animator(content, not_animate);
      // save in cache
      save_childs('song_info_text', content);
      // prepare image
      var url = ERROR_IMAGE_URL;
      if (info.med_cover) {
        url = info.med_cover;
      }
      var g = window.document.createElement('img');
      g.onload = function () {
        image_box_animator([g], not_animate);
        save_childs('song_info_image', [g]);
        // set and save fingerprint
        prev_fingerprint = info.fingerprint;
        window.dom_keeper.set('song_info_fp', prev_fingerprint);
      };
      g.onerror = function () {
        g.src = ERROR_IMAGE_URL;
      };
      g.src = url;
    }
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
    ['artist', 'title', 'album', 'med_cover', 'songid'].forEach(
      function (v) {
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

  return function (cache, not_animate_arg) {
    not_animate = not_animate_arg;
    if (cache.song_info_text) {
      text_box_animator(cache.song_info_text, true);
    }
    if (cache.song_info_image) {
      image_box_animator(cache.song_info_image, true);
    }
    if (cache.song_info_fp) {
      prev_fingerprint = cache.song_info_fp;
    }
    get_song_info();
  };

}());
