var amqp = require('amqplib/callback_api');

// 消费进程
amqp.connect('amqp://localhost', (err, conn) => {
	conn.createChannel((err, ch) => {
		var q = 'task_queue';

		ch.assertQueue(q, {durable: true});
		ch.prefetch(1);
		console.log('===waiting=for message in "%s"==', q);

		ch.consume(q, (msg) => {
			var secs = msg.content.toString().split('.').length - 1;

			console.log(" [x] Received %s", msg.content.toString());

			setTimeout(() => {
				console.log(' [x] Done');
				ch.ack(msg);
			}, secs * 1000);
		}, { noAck: false });
	})
})