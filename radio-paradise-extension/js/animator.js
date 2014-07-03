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

window.animator_generator = function (cb_step, cb_fin) {
  var current_strategy = [];
  function step() {
    var v = current_strategy.shift();
    cb_step(v);
    if (current_strategy.length === 0) {
      cb_fin();
    } else {
      window.setTimeout(step, 33);
    }
  }
  return function (strategy) {
    var l = current_strategy.length;
    current_strategy = strategy;
    if (l === 0) {
      step();
    }
  };
};
