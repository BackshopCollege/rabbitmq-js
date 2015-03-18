var amqp = require('amqplib/callback_api');

amqp.connect('amqp://localhost/blue', connected);

function connected(err, conn) {
  if (err)
    throw err;

  conn.createChannel(withChannel);
}

function withChannel(err, channel) {
  if (err)
    throw err;

  channel.assertQueue('default.queue');
  channel.publish('', 'default.queue', new Buffer('default queue message'));
}
