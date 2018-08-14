
const amqp = require('amqplib/callback_api');
const url = 'amqp://39.108.184.93'

const args = ['test-route2']

const q = 'hello'

amqp.connect(url, (err, conn) => {
  conn.createChannel(async (err, ch) => {
    const ex = 'wkToLCRM-test2'

    // ch.assertExchange(ex, 'direct', { durable: true})
    const res = await ch.assertQueue(q, { durable: true })
    console.log('==res=', res)
    // const msg = 'hello mq'
    // ch.sendToQueue(q, Buffer.from(msg))

    const res2 = ch.consume(q, async (msg)=>{
      // console.log('receive: msg ', msg)
      console.log('receive: msg ', msg.content.toString())

      const res3 = await ch.ack(msg)
      console.log('==res3=', res3)
    }, { noAck: false })

    /* ch.assertQueue('', { exclusive: true }, (err, q) => {
      console.log(' [*] Waiting for logs. To exit press CTRL+C');
      console.log('===q=', q)

      args.forEach(v => {
        ch.bindQueue(q.queue, ex, v)
      })
      console.log('queue', q.queue)

      ch.consume(q.queue, (msg) => { 
        ch.ack(msg)
        console.log('[x] "%s": "%s"', msg.fields.routingKey, msg.content.toString())
      }, {noAck: false})
    }) */
  })
})