const amqp = require('amqplib')
const url = 'amqp://39.108.184.93'

class RabbitMq {
  constructor(options) {
    this.ex = 'wkToLCRM-test2'
    this.exType = 'direct'
    this.durable = true
    this.routeKey = 'test-route2'
    this.autoDelete = true
    this.q = 'hello'
  }

  async send() {
    const conn = await amqp.connect(url)
    const msg = JSON.stringify({ a: "aa" })

    try {
      // const ch = await conn.createChannel()
      // 确认消息发送 ok
      const ch = await conn.createConfirmChannel()
      // const res = await ch.assertExchange(this.ex, this.exType, { durable: this.durable })
      await ch.assertQueue(this.q)
      // console.log('==res==', res)
      ch.sendToQueue(this.q, Buffer.from(msg))

      // ch.publish(this.ex, this.routeKey, Buffer.from(msg))

      // 发送失败 会reject
      const res2 = await ch.waitForConfirms()

      console.log('==res2=', res2)

      console.log(" [x] Sent '%s'", msg);
      

      ch.close()
    } catch (e) {
      console.log('==e==', e)
      ch.close()
    }
  }
}

const rabbit = new RabbitMq({})

rabbit.send()

