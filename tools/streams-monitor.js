var ERROR_LOG_FILE = __dirname + '/streams-monitor.log';
var STAT_FILE = __dirname + '/streams-monitor-stat.log';
var STREAMS_JS = __dirname + '/../radio-paradise-extension/js/streams.js';
var FIELD_SIZE = 10;

var url = require('url');
var http = require('http');
var fs = require('fs');
var vm = require('vm');

vm.runInThisContext(fs.readFileSync(STREAMS_JS), STREAMS_JS);

function create_line(a) {
  return a.map(function(v) {
    v = v.toString();
    var l = v.length;
    if (l > FIELD_SIZE) {
      v = v.substr(v.length - FIELD_SIZE);
    }
    if (l < FIELD_SIZE) {
      v = Array(FIELD_SIZE - l + 1).join(' ') + v;
    }
    return v;
  }).join(' ');
}

var collector = (function (streams) {
  var map = {};
  var count = streams.length;
  streams.forEach(function (v) {
    map[v[0]] = null;
  });
  return function(nik, code, dt, error) {
    if (error) {
      fs.appendFileSync(
        ERROR_LOG_FILE,
        (new Date()).toString() + ' [' + nik + '] ' + code + ' ' + dt + 'ms ' + error + '\n'
      )
    }
    map[nik] = {
      code: code,
      dt: dt,
      error: error
    }
    if (--count === 0) {
      console.log('FIN');
      console.log(map);
      console.log('====');
      fs.appendFileSync(
        STAT_FILE,
        (new Date()).toString() + '\n' +
        create_line(streams.map(function (x) {return x[0]})) + '\n' +
        create_line(streams.map(function (x) {var p = map[x[0]].code; return p === 200 ? 'ok' : p;})) + '\n' +
        create_line(streams.map(function (x) {return map[x[0]].dt})) + '\n'
      );
    }
  };
}(streams.list));

streams.list.forEach(function (v, n) {
  var nik = v[0];
  var addr = v[1].url;
  var up = url.parse(addr);
  var start = Date.now();
  var req = http.request({
    hostname: up.hostname,
    port: up.port,
    path: up.path,
    method: 'GET'
  }, function (r) {
    collector(nik, r.statusCode, Date.now() - start);
  });
  req.on('error', function(e) {
    collector(nik, e.errno, Date.now() - start, e.message);
  });
  req.end();
});
