
const amqp = require('amqplib');
const url = 'amqp://39.108.184.93'
const { log } = console;

class ReadRabbit {
	constructor(options) {
		this.open = this.connect;
		this.ex = options.ex || 'logs';
	}

	async connect() {
		return amqp.connect(url)
	}

	async readMsg(exchange, msg, errCallback) {
		let self = this;

		const connect = await self.open()
		log('connect: ', connect)
		log('===========')
		const channel = await connect.createChannel()
		log('channel: ', channel)
		log('===========')
		const res = await channel.assertExchange(self.ex, 'fanout', {durable: false})
		log('res: ', res)
		log('===========')
		const q = await channel.assertQueue('', { exclusive: true })
		log('result: ', q)
		log('===========')
		log(" [*] Waiting for messages in %s. To exit press CTRL+C", q.queue)

		const rpc = await channel.bindQueue(q.queue, self.ex, '')
		log('rpc: ', rpc)
		log('==========')
		const final = await channel.consume(q.queue, (msg) => {
			log('====msg=', msg)
			console.log(" [x] %s", msg.content.toString());
		}, {noAck: true})
		log('final: ', final)
	}
}

const ReadQueue = new ReadRabbit({});

ReadQueue.readMsg()