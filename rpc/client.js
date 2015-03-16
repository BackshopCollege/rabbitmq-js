var amqp = require('amqplib/callback_api');

amqp.connect('amqp://localhost/blue', connected);

function connected(err, conn) {
  if (err)
    throw err;

  createChannel(conn);
}

function createChannel(conn) {
  conn.createChannel(withChannel);
}

function withChannel(err, channel) {
  if (err)
    throw err;

  channel.assertQueue('', { exclusive: true }, withQueue);
  function withQueue(err, ok) {
    if (err)
      throw err;

    var queue = ok.queue;
    channel.consume(queue, response, { noAck: true });
    channel.sendToQueue('aritmetic', new Buffer('1 + 20'), { replyTo: queue });
  }

  function response(msg) {
    var res = msg.content.toString();
    console.log(res);
  }
}
