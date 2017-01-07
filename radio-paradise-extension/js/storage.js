/*
 * Radio Paradise player
 * Copyright (c) 2014-2017 Alexey Michurin <a.michurin@gmail.com>
 * MIT License [http://www.opensource.org/licenses/mit-license.php]
 */

/*global chrome */
/*global streams */
/*exported storage */

'use strict';

var storage = (function () {
  var local_storage = chrome.storage.local;
  function mk_array() {
    return [];
  }
  function mk_obj() {
    return {};
  }
  var defaults = {
    animation: true,
    badge_background_color: '#942',
    custom_streams: mk_array,
    hidden_custom_streams: mk_obj,
    hidden_streams: streams.def.hidden,
    playing: false,
    popup: true,
    stream_id: streams.def.stream,
    volume: 0.75
  };
  function fix(k, v) {
    var g;
    if (v === undefined) {
      g = defaults[k];
      if (typeof g === 'function') {
        return g();
      }
      return g;
    }
    return v;
  }
  return {
    get: function (a, f) {
      local_storage.get(a, function (x) {
        var b = {};
        a.forEach(function (k) {
          b[k] = fix(k, x[k]);
        });
        f(b);
      });
    },
    set: function (a, f) {
      local_storage.set(a, f);
    },
    remove: function (a, f) {
      local_storage.remove(a, f);
    },
    onchange: function (mp) {
      chrome.storage.onChanged.addListener(function (a, area) {
        if (area === 'local') {
          var k, cb;
          for (k in a) {
            if (a.hasOwnProperty(k)) {
              cb = mp[k];
              if (cb) {
                cb(fix(k, a[k].newValue));
              }
            }
          }
        }
      });
    },
    toggle_playing_state: function () {
      storage.get(['playing'], function (x) {
        local_storage.set({playing: !x.playing});
      });
    },
    update_field: function (name) {
      var p = {};
      p[name] = (new Date()).toUTCString();
      local_storage.set(p);
    }
  };
}());
