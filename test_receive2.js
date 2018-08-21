
const amqp = require('amqplib')

const connectObj = {
  protocol: 'amqp',
  hostname: '39.108.184.93',
  port: 5672,
  username: 'yuanzhe',
  password: 'yuanzhe',
  frameMax: 0,
  heartbeat: 0,
  vhost: '/wk',
}

const INNER = {
  protocol: 'amqp',
  hostname: '172.29.2.89',
  port: 5672,
  username: '',
  password: '',
  frameMax: 0,
  heartbeat: 0,
  vhost: '/wk'
}

function timeout(ms) {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, ms, 'done');
  });
}
class RabbitMq {
  constructor(options) {
    // this.ex = 'wkToLrcm-applyInfo'
    this.ex = 'wk.lcrm.applyInfo'
    this.exType = 'direct'
    this.durable = true
    this.routeKey = 'wk.lcrm.applyInfo'
    this.queue = 'wk.lcrm.applyInfo.queue'
    this.autoDelete = true
  }

  async send() {
    const conn = await amqp.connect(INNER)
    // console.log('==conn==', conn)
    try {
      const ch = await conn.createChannel()
      // 确认消息发送 ok
      const res = await ch.assertExchange(this.ex, this.exType, { durable: this.durable })
      // 此处 q 置空，用的是rabbitmq自动生成的队列名, exclusive 是生成排他队列, 连接断开后就会自动删除
      const q = await ch.assertQueue(this.queue, { exclusive: false })

      console.log('==q=', q)
      // 队列绑定 exchange
      // ch.bindQueue(q.queue, this.ex, this.routeKey)
      ch.bindQueue(q.queue, this.ex, this.routeKey)
      ch.prefetch(1);
      // ch.consume(q.queue, msg => {
      ch.consume(q.queue, async msg => {
        const res = JSON.parse(msg.content.toString())
        console.log('收到消息: ', res.currentPage)

        // await timeout(5000)
         // 发送确认消息
        ch.ack(msg)
        // this.ackMsg(msg, ch, 'success')
        // this.ackMsg(msg, ch, )
      }, { noAck: false })

      // ch.close()
    } catch (e) {
      console.log('==e==', e)
      ch.close()
    }
  }

  async ackMsg(msg, ch, result) {
    // queue content options cb
    // ch.sendToQueue(msg.properties.replyTo,
    //               Buffer.from(result),
    //               { correlationId: msg.properties.correlationId }, (arg) => {
    //                 console.log('=ack==', arg)
    //               })
    ch.ack(msg) // 确认后, 才会删除 队列中的消息, 防止重复消费
  }
}

const rabbit = new RabbitMq({})

rabbit.send()