
var amqp = require('amqplib');

const url = 'amqp://39.108.184.93'
const { log } = console;

class RabbitMQ {
	constructor(opt) {
		this.open = this.connect;
		this.ex = opt.ex || 'logs'
	}

	async connect() {
		return amqp.connect(url)
	}

	async sendQueueMsg(msg, errCallback) {
		let self = this;

		const connect = await self.open();

		const channel = await connect.createChannel();

		await channel.assertExchange(self.ex, 'fanout', { durable: false })
		msg = new Buffer(msg)
		console.log('msg: --->', msg)
		const res = await channel.publish(self.ex, '', msg);

		log('res: ', res);
		log(" [x] Sent %s", msg)

		return this;
	}
}

const rabbit = new RabbitMQ({});
const msg = process.argv.slice(2).join(' ') || JSON.stringify({ code: '000000', status: "success", list: [ {a: "aa" } ] })
rabbit.sendQueueMsg(msg, (err) => { log("err: ", err); })