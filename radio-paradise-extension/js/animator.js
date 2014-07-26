/*
 * Radio Paradise player
 * Copyright (c) 2014 Alexey Michurin <a.michurin@gmail.com>
 * MIT License [http://www.opensource.org/licenses/mit-license.php]
 */

/*global window */
/*exported animator_generator */

'use strict';

function animator_generator(cb_step, cb_fin) {
  var current_strategy = [];
  function step() {
    var v;
    if (current_strategy.length === 0) {
      cb_fin();
    } else {
      v = current_strategy.shift();
      cb_step(v);
      window.setTimeout(step, 20);
    }
  }
  return function (strategy) {
    // strategy will be changed!
    // it can be useful side effect
    var l = current_strategy.length;
    current_strategy = strategy;
    if (l === 0) {
      step();
    }
  };
}
