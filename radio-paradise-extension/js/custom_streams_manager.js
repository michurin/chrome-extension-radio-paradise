/*
 * Radio Paradise player
 * Copyright (c) 2014 Alexey Michurin <a.michurin@gmail.com>
 * MIT License [http://www.opensource.org/licenses/mit-license.php]
 */

/*global opacity_animator_generator, storage, $ */

'use strict';

(function () {

  var root = $.id('custom-streams-root');

  var dialog_add = opacity_animator_generator('dialog-create-new-custom-stream');
  var dialog_remove = opacity_animator_generator('dialog-remove-custom-stream');

  var panel = {
    init: function (streams, hidden, active_stream_id) {
      panel.streams = streams || [];
      panel.hidden = hidden || {};
      panel.active_stream_id = active_stream_id || '-';
      panel.redraw();
    },
    set_stream_id: function (a) {
      panel.active_stream_id = a;
      panel.update_active();
    },
    set_streams: function (s) {
      var f;
      panel.streams = s || [];
      panel.redraw();
      if (panel.active_stream_id.substr(0, 7) === 'custom_') {
        f = false;
        panel.streams.forEach(function (v) {
          f = (f || v[0] === panel.active_stream_id);
        });
        if (!f) {
          // we delete an active stream, drop to default stream
          storage.remove(['stream_id']);
        }
      }
    },
    set_hidden: function (h) {
      panel.hidden = h || {};
      panel.update_checkboxes();
    },
    // private
    redraw: function () {
      if (panel.streams.length === 0) {
        root.innerText = '(no custom streams)';
      } else {
        $.empty(root);
        var len = panel.streams.length;
        panel.streams.forEach(function (v, n) {
          var p = (n + len - 1) % len;
          var q = (n + len + 1) % len;
          var stream_iid = v[0];
          var stream = v[1];
          var label = $.create('label');
          label.setAttribute('for', 'stream-' + stream_iid);
          root.appendChild(label);
          var input = $.create('input');
          input.type = 'checkbox';
          input.id = 'stream-' + stream_iid;
          input.onchange = function () {
            var s = {};
            $.each(root, 'input:not(:checked)', function (v) {
              s[v.id.substr(7)] = true;
            });
            storage.set({hidden_custom_streams: s});
          };
          label.appendChild(input);
          label.appendChild($.tx());
          var b = $.create('b');
          b.innerText = stream.title;
          label.appendChild(b);
          label.appendChild($.tx());
          var span = $.create('span');
          span.id = 'active-' + stream_iid;
          span.className = 'stream-star';
          span.title = 'choose custom stream';
          label.appendChild(span);
          label.appendChild($.tx());
          var a = $.create('a');
          a.target = '_blank';
          a.href = stream.url;
          a.innerText = stream.url;
          label.appendChild(a);
          label.appendChild($.tx());
          b = $.create('span');
          b.className = 'control-char';
          b.innerText = '⇧';
          b.title = 'move up';
          b.onclick = function (e) {
            e.stopPropagation();
            e.preventDefault();
            panel.swap(n, p); // redraw will be fired by event
          };
          label.appendChild(b);
          label.appendChild($.tx());
          b = $.create('span');
          b.className = 'control-char';
          b.innerText = '⇩';
          b.title = 'move down';
          b.onclick = function (e) {
            e.stopPropagation();
            e.preventDefault();
            panel.swap(n, q);
          };
          label.appendChild(b);
          label.appendChild($.tx());
          b = $.create('span');
          b.innerText = '⚙';
          b.className = 'control-char';
          b.title = 'edit stream';
          b.onclick = function (e) {
            e.stopPropagation();
            e.preventDefault();
            $.id('dialog-create-new-custom-stream-name').value = stream.title;
            $.id('dialog-create-new-custom-stream-url').value = stream.url;
            $.id('dialog-create-new-custom-stream-id').value = stream_iid;
            dialog_add.open();
          };
          label.appendChild(b);
          label.appendChild($.tx());
          b = $.create('span');
          b.className = 'control-char';
          b.innerText = '☒';
          b.title = 'remove stream';
          b.onclick = function (e) {
            e.stopPropagation();
            e.preventDefault();
            $.id('dialog-remove-custom-stream-delete').onclick = function () {
              panel.remove_stream(stream_iid);
              dialog_remove.close();
            };
            dialog_remove.open();
          };
          label.appendChild(b);
        });
        panel.update_active();
        panel.update_checkboxes();
      }
    },
    update_active: function () {
      $.each(root, 'span.stream-star', function (v) {
        var id = v.id.substr(7);
        if (panel.active_stream_id === id) {
          v.innerText = '★';
          v.className = 'stream-star';
          v.onclick = undefined;
        } else {
          v.innerText = '☆';
          v.className = 'stream-star cursor-pointer';
          v.onclick = function (e) {
            e.stopPropagation();
            e.preventDefault();
            storage.set({stream_id: id});
          };
        }
      });
    },
    update_checkboxes: function () {
      $.each(root, 'input', function (v) {
        v.checked = !panel.hidden[v.id.substr(7)];
      });
    },
    remove_stream: function (iid) {
      var x = [];
      panel.streams.forEach(function (v) {
        if (v[0] !== iid) {
          x.push(v);
        }
      });
      storage.set({custom_streams: x});
    },
    swap: function (a, b) {
      // it is not realy swap a and b
      // it shift element a to position b
      var tmp = panel.streams[a];
      panel.streams.splice(a, 1);
      panel.streams.splice(b, 0, tmp);
      storage.set({custom_streams: panel.streams});
    }
  };

  storage.onchange({
    stream_id: panel.set_stream_id,
    custom_streams: panel.set_streams,
    hidden_custom_streams: panel.set_hidden
  });

  $.id('custom-streams-add-button').onclick = function () {
    $.id('dialog-create-new-custom-stream-name').value = '';
    $.id('dialog-create-new-custom-stream-url').value = '';
    $.id('dialog-create-new-custom-stream-id').value = '';
    dialog_add.open();
  };
  $.id('dialog-create-new-custom-stream-cancel').onclick = dialog_add.close;
  $.id('dialog-create-new-custom-stream-save').onclick = function () {
    var stream_name = $.id('dialog-create-new-custom-stream-name').value;
    var stream_url = $.id('dialog-create-new-custom-stream-url').value;
    var stream_id = $.id('dialog-create-new-custom-stream-id').value;
    var mode;
    if (stream_id === '') {
      mode = 'add';
      stream_id = 'custom_' +
        (new Date().getTime()) + '_' +
        Math.floor(10000 + 10000 * Math.random()).toString(10).substr(1);
    } else {
      mode = 'edit';
    }
    var pair = [stream_id, {
      url: stream_url,
      title: stream_name
    }];
    storage.get(['custom_streams'], function (x) {
      var streams = x.custom_streams || [];
      var t;
      if (mode === 'add') {
        streams.push(pair);
        storage.set({custom_streams: streams});
      } else {
        t = [];
        streams.forEach(function (v) {
          t.push(v[0] === stream_id ? pair : v);
        });
        storage.set({custom_streams: t});
      }
    });
    dialog_add.close();
  };
  $.id('dialog-remove-custom-stream-cancel').onclick = dialog_remove.close;

  storage.get(['stream_id', 'custom_streams', 'hidden_custom_streams'], function (x) {
    panel.init(x.custom_streams, x.hidden_custom_streams, x.stream_id);
  });

}());
