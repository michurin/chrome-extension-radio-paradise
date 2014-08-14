/*
 * Radio Paradise player
 * Copyright (c) 2014 Alexey Michurin <a.michurin@gmail.com>
 * MIT License [http://www.opensource.org/licenses/mit-license.php]
 */

/*global window */
/*global opacity_animator_generator, storage, on_storage_change, streams */

'use strict';

(function () {

  var root = window.document.getElementById('custom-streams-root');

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
      panel.streams = s || [];
      panel.redraw();
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
        root.innerText = '';
        var len = panel.streams.length;
        panel.streams.forEach(function (v, n) {
          var p = (n + len - 1) % len;
          var q = (n + len + 1) % len;
          var stream_iid = v[0];
          var stream = v[1];
          var label = window.document.createElement('label');
          label.setAttribute('for', 'stream-' + stream_iid);
          root.appendChild(label);
          var input = window.document.createElement('input');
          input.type = 'checkbox';
          input.id = 'stream-' + stream_iid;
          input.onchange = function () {
            var s = {};
            Array.prototype.slice.call(root.querySelectorAll('input'), 0).forEach(function (v) {
              if (! v.checked) {
                s[v.id.substr(7)] = true;
              }
            });
            storage.set({hidden_custom_streams: s});
          };
          label.appendChild(input);
          var b = window.document.createElement('b');
          b.innerText = ' ' + stream.title;
          label.appendChild(b);
          var span = window.document.createElement('span');
          span.id = 'active-' + stream_iid;
          span.title = 'choose custom stream';
          span.className = 'cursor-ponter';
          span.onclick = function (e) {
            e.stopPropagation();
            e.preventDefault();
            storage.set({stream_id: stream_iid});
          };
          label.appendChild(span);
          var a = window.document.createElement('a');
          a.target = '_blank';
          a.href = stream.url;
          a.innerText = stream.url;
          label.appendChild(a);
          b = window.document.createElement('b');
          b.innerText = ' ⚙';
          b.title = 'edit stream';
          b.onclick = function (e) {
            e.stopPropagation();
            e.preventDefault();
            window.document.getElementById('dialog-create-new-custom-stream-name').value = stream.title;
            window.document.getElementById('dialog-create-new-custom-stream-url').value = stream.url;
            window.document.getElementById('dialog-create-new-custom-stream-id').value = stream_iid;
            dialog_add.open();
          };
          label.appendChild(b);
          b = window.document.createElement('b');
          b.innerText = ' ☒';
          b.title = 'remove stream';
          b.onclick = function (e) {
            e.stopPropagation();
            e.preventDefault();
            window.document.getElementById('dialog-remove-custom-stream-delete').onclick = function () {
              panel.remove_stream(stream_iid);
              dialog_remove.close();
            };
            dialog_remove.open();
          };
          label.appendChild(b);
          b = window.document.createElement('b');
          b.innerText = ' ⇧';
          b.title = 'move up';
          b.onclick = function (e) {
            e.stopPropagation();
            e.preventDefault();
            panel.swap(n, p); // redraw will be fired by event
          };
          label.appendChild(b);
          b = window.document.createElement('b');
          b.innerText = ' ⇩';
          b.title = 'move down';
          b.onclick = function (e) {
            e.stopPropagation();
            e.preventDefault();
            panel.swap(n, q);
          };
          label.appendChild(b);
        });
        panel.update_active();
        panel.update_checkboxes();
      }
    },
    update_active: function () {
      Array.prototype.slice.call(root.querySelectorAll('span'), 0).forEach(function (v) {
        v.innerText = panel.active_stream_id === v.id.substr(7) ? ' ★ ' : ' ☆ ';
      });
    },
    update_checkboxes: function () {
      Array.prototype.slice.call(root.querySelectorAll('input'), 0).forEach(function (v) {
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

  on_storage_change(function (cn) {
    if (cn.stream_id) {
      panel.set_stream_id(cn.stream_id.newValue);
    }
    if (cn.custom_streams) {
      panel.set_streams(cn.custom_streams.newValue);
    }
    if (cn.hidden_custom_streams) {
      panel.set_hidden(cn.hidden_custom_streams.newValue);
    }
  });

  window.document.getElementById('custom-streams-add-button').onclick = function () {
    window.document.getElementById('dialog-create-new-custom-stream-name').value = 'radio';
    window.document.getElementById('dialog-create-new-custom-stream-url').value = 'http://';
    window.document.getElementById('dialog-create-new-custom-stream-id').value = '';
    dialog_add.open();
  };
  window.document.getElementById('dialog-create-new-custom-stream-cancel').onclick = dialog_add.close;
  window.document.getElementById('dialog-create-new-custom-stream-save').onclick = function () {
    var stream_name = window.document.getElementById('dialog-create-new-custom-stream-name').value;
    var stream_url = window.document.getElementById('dialog-create-new-custom-stream-url').value;
    var stream_id = window.document.getElementById('dialog-create-new-custom-stream-id').value;
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
    storage.get({custom_streams: null}, function (x) {
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
  window.document.getElementById('dialog-remove-custom-stream-cancel').onclick = dialog_remove.close;

  storage.get({
    stream_id: streams.def.stream,
    custom_streams: null,
    hidden_custom_streams: null
  }, function (x) {
    panel.init(x.custom_streams, x.hidden_custom_streams, x.stream_id);
  });

}());
