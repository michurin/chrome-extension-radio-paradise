/*
 * Radio Paradise player
 * Copyright (c) 2014 Alexey Michurin <a.michurin@gmail.com>
 * MIT License [http://www.opensource.org/licenses/mit-license.php]
 */

/*global window, chrome */
/*global streams, storage */
/*jslint
  indent:   2,
  vars:     true,
  plusplus: true
*/

"use strict";

(function () {
  console.log(window.document.querySelectorAll('input[name="control_mode"]'));
  Array.prototype.slice.call(
    window.document.querySelectorAll('input[name="control_mode"]')
  ).forEach(function (v, n) {
    v.disabled = false;
  });
}());
