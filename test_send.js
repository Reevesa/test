const amqp = require('amqplib')
const url = 'amqp://39.108.184.93'

class RabbitMq {
  constructor(options) {
    this.ex = 'wkToLCRM-test'
    this.exType = 'direct'
    this.durable = true
    this.routeKey = 'test-route'
    this.autoDelete = true
  }

  async send() {
    const conn = await amqp.connect(url)
    const msg = JSON.stringify({ a: "aa" })

    try {
      // const ch = await conn.createChannel()
      // 确认消息发送 ok
      const ch = await conn.createConfirmChannel()
      const res = await ch.assertExchange(this.ex, this.exType, { durable: this.durable })
      console.log('==res==', res)

      ch.publish(this.ex, this.routeKey, Buffer.from(msg))

      // 发送失败 会reject
      ch.waitForConfirms().then((res, arg) => {
        console.log('=res1==', res)
        console.log('=res2==', arg)
      }).catch(err => {
        console.warn('error: ', err)
      })
      

      ch.close()
    } catch (e) {
      console.log('==e==', e)
      ch.close()
    }
  }
}

const rabbit = new RabbitMq({})

rabbit.send()

