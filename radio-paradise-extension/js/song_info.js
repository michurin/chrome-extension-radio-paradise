/*
 * Radio Paradise player
 * Copyright (c) 2014-2016 Alexey Michurin <a.michurin@gmail.com>
 * MIT License [http://www.opensource.org/licenses/mit-license.php]
 */

/*global window */
/*global height_animator_generator, open_url_in_new_tab, $ */
/*exported image_info_init */

'use strict';

var image_info_init = (function () {

  var RP_INFO_URL = 'http://radioparadise.com/ajax_xml_song_info.php?song_id=now';
  var RP_SONGINFO_BASE = 'http://www.radioparadise.com/rp_2.php?#name=songinfo&song_id=';
  var ERROR_IMAGE_URL = 'images/0.jpg';

  var prev_fingerprint = '';

  var not_animate = false;

  var text_box_animator = height_animator_generator(
    $.id('song-info-text'),
    $.id('song-info-text-wrapper')
  );

  var image_box_animator = height_animator_generator(
    $.id('song-info-image'),
    $.id('song-info-image-wrapper')
  );

  function make_clickable(songid) {
    var e = $.id('song-info');
    e.style.cursor = 'pointer';
    e.onclick = (function (url) {
      return function () {
        open_url_in_new_tab(url);
      };
    }(RP_SONGINFO_BASE + songid));
  }

  function save_dom_items(k, e) {
    window.dom_keeper.set(k, e.map(function (x) {
      return x.cloneNode(true);
    }));
  }

  function display_song_info(info) {
    if (info.fingerprint !== prev_fingerprint) {
      // prepare onclick
      var songid = info.songid;
      if (songid) {
        make_clickable(songid);
        window.dom_keeper.set('song_info_songid', songid);
      }
      // prepare text
      var content = [];
      [['artist', 'Artist'], ['title', 'Title'], ['album', 'Album']].forEach(
        function (v) {
          var x;
          var t = info[v[0]];
          if (t) {
            x = $.create('div');
            x.innerText = '• ' + v[1] + ' •';
            x.className = 'song-info-title';
            content.push(x);
            x = $.create('div');
            x.innerText = t;
            x.className = 'song-info';
            content.push(x);
          }
        }
      );
      text_box_animator(content, not_animate);
      // save in cache
      save_dom_items('song_info_text', content);
      // prepare image
      var url = ERROR_IMAGE_URL;
      if (info.med_cover) {
        url = info.med_cover;
      }
      var g = $.create('img');
      g.onload = function () {
        var gg = [g];
        image_box_animator(gg, not_animate);
        save_dom_items('song_info_image', gg);
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

  function parse_song_info(dom, show_release_date) {
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
    ['release_date', 'artist', 'title', 'album', 'med_cover', 'songid'].forEach(
      function (v) {
        var ee, e, t;
        ee = fc.getElementsByTagName(v);
        if (ee.length > 0) {
          e = ee[0];
        }
        if (e && typeof e.textContent === 'string') {
          t = e.textContent;
          if (show_release_date && v === 'album') {
            t += ' (' + (info.release_date || 'n/a') + ')';
          }
          info[v] = t;
          info.fingerprint += '::' + t; // updated album have to get into fingerprint
        }
      }
    );
    return info;
  }

  function mk_get_song_info(show_release_date) {
    function get_song_info() {
      var xhr = new window.XMLHttpRequest();
      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
          var info = parse_song_info(xhr.responseXML, show_release_date);
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
    return get_song_info;
  }

  return function (cache, not_animate_arg, show_release_date) {
    not_animate = not_animate_arg;
    if (cache.song_info_songid) {
      make_clickable(cache.song_info_songid);
    }
    if (cache.song_info_text) {
      text_box_animator(cache.song_info_text, true);
    }
    if (cache.song_info_image) {
      image_box_animator(cache.song_info_image, true);
    }
    if (cache.song_info_fp) {
      prev_fingerprint = cache.song_info_fp;
    }
    mk_get_song_info(show_release_date)();
  };

}());
