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

  channel.assertQueue('aritmetic');
  channel.prefetch(1);
  channel.consume('aritmetic', calculate);

  function calculate(msg) {
    var operation = msg.content.toString();
    var replyTo = msg.properties.replyTo;
    console.log('-- replyTo %s', replyTo);

    console.log('-- calculating %s', operation);
    var result = eval(operation); // please , sanitize before do this

    // wait wait wait, you told us that we do not publish directly to queue.
    channel.sendToQueue(replyTo, new Buffer(result.toString()));
    channel.ack(msg);
  }
}


