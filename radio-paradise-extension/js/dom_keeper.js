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

window.dom_keeper = (function () {

  var CACHE_EXPIRATION_MS = 10000;

  var cache = {};
  var expire_timer_id;

  function expire() {
    cache = {};
    expire_timer_id = undefined;
  }

  return {
    set: function (k, v) {
      console.log(k);
      console.log(v);
      cache[k] = v;
      if (expire_timer_id) {
        window.clearTimeout(expire_timer_id);
      }
      expire_timer_id = window.setTimeout(expire, CACHE_EXPIRATION_MS);
    },
    get_all: function () {
      console.log('return', cache);
      return cache; // return cache itself, not a copy
    }
  };

}());
