/*
 * Radio Paradise player
 * Copyright (c) 2014 Alexey Michurin <a.michurin@gmail.com>
 * MIT License [http://www.opensource.org/licenses/mit-license.php]
 */

/*global window */
/*exported $ */

'use strict';

var $ = (function (doc) {
  return {
    body: doc.body,
    create: function (tag) {
      return doc.createElement(tag);
    },
    id: function (id) {
      return doc.getElementById(id);
    },
    each: function (root, selector, callback) {
      Array.prototype.slice.call(root.querySelectorAll(selector), 0).forEach(callback);
    },
    tx: function (text) {
      return doc.createTextNode(text || ' ');
    }
  };
}(window.document));
