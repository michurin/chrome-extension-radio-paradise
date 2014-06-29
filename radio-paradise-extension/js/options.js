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
  storage.get_all(function (a, b, c, control_mode) {
    window.document.getElementById(control_mode).checked = true;
    Array.prototype.slice.call(
      window.document.querySelectorAll('input[name="control_mode"]')
    ).forEach(function (v, n) {
      v.disabled = false;
      v.onchange = function () {
        storage.set_control_mode(this.id);
      };
    });
  });
}());
