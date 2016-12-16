// connect to websocket server
var ws = new WebSocket('ws://' + settings.host + ':' + settings.cwsPort +'/');

// receive
ws.onmessage = function(event) {
  var data = JSON.parse(event.data);
  // pushされたメッセージを解釈し、要素を生成する
  console.log(data);
  $('#chat-history').prepend(item).hide().fadeIn(500);
};

// update event
// exports.hoge = function(event) {
//   ws.send(JSON.stringify({
//     type: 'chat',
//     user: userName,
//     data: log
//   }));
//   textbox.value = '';
// };

// ブラウザ終了イベント
// window.onbeforeunload = function () {
//   ws.send(JSON.stringify({
//     type: 'defect',
//     user: userName,
//   }));
// };
