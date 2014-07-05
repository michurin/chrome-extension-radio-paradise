/*
 * Radio Paradise player
 * Copyright (c) 2014 Alexey Michurin <a.michurin@gmail.com>
 * MIT License [http://www.opensource.org/licenses/mit-license.php]
 */

/*global window, chrome */
/*jslint
  indent:   2,
  vars:     true,
  plusplus: true
*/

'use strict';

window.dom_keeper = (function () {

  return {
    set: function (k, v) {
      chrome.runtime.getBackgroundPage(function (w) {
        w.dom_keeper.set(k, v);
      });
    },
    get_all: function (f) {
      chrome.runtime.getBackgroundPage(function (w) {
        f(w.dom_keeper.get_all());
      });
    }
  };

}());
