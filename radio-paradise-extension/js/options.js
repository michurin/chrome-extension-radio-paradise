/*
 * Radio Paradise player
 * Copyright (c) 2014 Alexey Michurin <a.michurin@gmail.com>
 * MIT License [http://www.opensource.org/licenses/mit-license.php]
 */

/*global window */
/*global storage */
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

  storage.get({
    popup: true
  }, function (x) {
    window.document.getElementById(x.popup ? 'popup' : 'one-click').checked = true;
    Array.prototype.slice.call(
      window.document.querySelectorAll('input[name="control_mode"]')
    ).forEach(function (v, n) {
      v.disabled = false;
      v.onchange = pupup_setter(v.id === 'popup');
    });
  });

}());
