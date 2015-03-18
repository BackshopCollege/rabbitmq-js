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

  channel.assertExchange(exchange, 'direct', {durable: false }, function(err, ok) {
    if (err)
      throw err;

    var message = ' direct message';
    console.log('publishing: %s', message);
    channel.publish(exchange, key, new Buffer(message));
  });
}

