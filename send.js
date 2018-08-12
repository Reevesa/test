var amqp = require('amqplib/callback_api');
// var amqp = require('amqplib');

console.log('===',amqp)

amqp.connect('amqp://127.0.0.1', function(err, conn) {
	console.log('=conn=', conn)
  conn.createChannel(function(err, ch) {
    var q = 'hello';
    var msg = 'Hello World!';

    ch.assertQueue(q, {durable: false});
    ch.sendToQueue(q, Buffer.from(msg));
    console.log(" [x] Sent %s", msg);
  });
  setTimeout(function() { conn.close(); process.exit(0) }, 500);
});
