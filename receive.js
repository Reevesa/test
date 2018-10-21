var amqp = require('amqplib/callback_api');
const url = 'amqp://39.108.184.93'

amqp.connect(url, function(err, conn) {
  console.log('==conn==', conn)
  conn.createChannel(function(err, ch) {
    var q = 'hello';

    ch.assertQueue(q, {durable: false});
    console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", q);
    ch.consume(q, function(msg) {
      console.log(" [x] Received %s", msg.content.toString());
    }, {noAck: true});
  });
});