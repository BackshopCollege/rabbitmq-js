var amqp = require('amqplib/callback_api');

var URL = 'amqp://localhost/blue';
var exchange = 'YLD.DIRECT';
var key = 'direct.key';

amqp.connect(URL, connected);

function connected(err, conn) {
  if (err !== null)
    throw err;

  conn.createChannel(withChannel);
}

function withChannel(err, channel) {
  if (err)
    throw err;

  channel.assertQueue('direct.queue', { }, function(err, ok) {
    if (err)
      throw err;

    channel.bindQueue(ok.queue, exchange, 'direct.key', {}, function(err) {
      channel.consume(ok.queue, onMsg, { noAck: false});
    });
  });

  function onMsg(msg) {
    var key = msg.fields.routingKey;
    var content = msg.content.toString();
    console.log('received: key [ %s ] %s', key, content);
    channel.ack(msg);
  }
}

