const WebSocket = require ('ws');
const config = {
  nickname: '::: RevoBot :::',
  prefix: '!',
  room: "103053272"
};

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;

const users = [];

function getStr (index1, index2, index3) {
  return index1.split (index2)[1].split (index3)[0].trim ();
} 

const ws = new WebSocket ('wss://wss.xatbox.com/v2', {
  host: 'wss.xatbox.com', 
  origin: 'https://xat.com',
  perMessageDeflate: true,
  protocolVersion: 13,
});

ws.on ('open', function () {
  /* Connect */
  ws.send (`<y r="${config.room}" v="0" u="1535310157" />`);
});

ws.on ('message', function incoming (data) {
  var message = data.toString ();
  console.log (message);
  var arg1 = message.split ('<')[1].split (' ')[0];
  switch (arg1) {
    case 'y':
      let token = getStr (message, `i="`, `"`);
      ws.send (
        `<j2 cb="0" Y="2" l5="per" l4="901" l3="800" l2="0" y="${token}" k="12e268c8c55d881bf500" k3="0" z="m1.20.0,3" p="0" c="${config.room}" f="0" u="1535310157" n="${config.nickname}" a="1458" h="" v="0" />`
      );
      break;
    case 'u':
      var id = getStr (message, `u="`, `"`);
      let nome = getStr (message, `n="`, `"`);
      users[id] = nome;
      ws.send (`<p u="${id}" t="Whatsup! welcome to channel" />`);
      break;
    case 'l':
      var id = getStr (message, `u="`, `"`);
      ws.send (`<m t="${users[id]} - left to chat!" u="1535310157" />`);
      break;
    case 'm':
      // Receber mensagem
      var mensagem = getStr (message, `t="`, `"`);
      if (mensagem.substr (0, 1) == config.prefix) {
        var divi = mensagem.split (' ');
        var arg1 = divi.splice (0, 1)[0];
        var arg2 = divi.join (' ');
        switch (arg1) {
          case '!ping':
            ws.send (`<m t="(tongue) pong" u="1535310157" />`);
            break;
          case '!onlines':
            ws.send (
              `<m t="${Object.keys (users).length} users online in chat." u="1535310157" />`
            );
            break;
          case '!say':
            ws.send (`<m t="- ${arg2}" u="1535310157" />`);
            break;
          default:
            ws.send (
              `<m t="${mensagem.split (' ')[0]} command not found!" u="1535310157" />`
            );
            break;
        }
      }
      break;
  }
});
