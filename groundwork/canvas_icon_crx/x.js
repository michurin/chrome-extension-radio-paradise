//chrome.browserAction.setIcon({
//  path: 'canvas_icon.png'
//});

var c = document.createElement('canvas');
c.width = 38;
c.height = 38;
var ctx = c.getContext('2d');

var state = 0;
function f() {
  state = (state + 1) % 18;
  var v = state < 10 ? state : (18 - state);
  ctx.beginPath();
  ctx.fillStyle = '#' + v + v + v;
  ctx.rect(0, 0, 19, 19);
  ctx.fill();
  chrome.browserAction.setIcon({
    imageData: {
       '38': ctx.getImageData(0, 0, 38, 38)
    }
  });
  setTimeout(f, 20);
}

f();
