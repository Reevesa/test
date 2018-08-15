const amqp = require('amqplib')
const url = 'amqp://39.108.184.93:5672'


function timeout(ms) {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, ms, 'done');
  });
}
let count = 0
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
    const msg = JSON.stringify({ a: "aa"+ count})
    console.log('==conn==', conn)
    // 捕获错误
    conn.on('error', (err) => {
      console.log('conn error: ', err)
    })
    // 捕获 return
    conn.on('return',(msg) => {
      console.log('==mag=', msg)
    })
    try {
      // const ch = await conn.createChannel()
      // 确认消息发送 ok 猜测是开启 confirm 机制，对应的监听函数是什么呢?
      const ch = await conn.createConfirmChannel()
      const res = await ch.assertExchange(this.ex, this.exType, { durable: this.durable })

      var flag = 0
      while(flag < 4) {
        // 实现消息持久化, 要exchange,queue,msg 三者同时持久化
        /*
        如果exchange根据自身类型和消息routeKey无法找到一个符合条件的queue，
        那么会调用basic.return方法将消息返回给生产者（Basic.Return + Content-Header + Content-Body）；
        当mandatory设置为false时，出现上述情形broker会直接将消息扔掉
        */
        ch.publish(this.ex, this.routeKey, Buffer.from(msg), {
          persistent: true, // 消息持久化
          mandatory: true   // 找不到合适的 key, 会返还给生产者
        }, (arg) => {
          console.log('==发送消息==', arg)
        })
        // 确认消息已经入队, 返回错误 是啥样? 错误怎么处理?直接close?
        const res2 = await ch.waitForConfirms()
        console.log('==res2==', res2)

        console.log(" [x] Sent '%s'", msg);

        await timeout(5000)
        flag++
        count++
      }
      ch.close()
    } catch (e) {
      console.log('==e==', e)
      ch.close()
    }
  }
}

const rabbit = new RabbitMq({})

rabbit.send()

