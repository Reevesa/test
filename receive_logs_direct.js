
const amqp = require('amqplib/callback_api');
const url = 'amqp://39.108.184.93'

const args = ['rabbit-route']

amqp.connect(url, (err, conn) => {
  conn.createChannel((err, ch) => {
    const ex = 'wkToLCRM-getCustomerInfo'

    ch.assertExchange(ex, 'direct', { durable: true })

    ch.assertQueue('', { exclusive: true }, (err, q) => {
      console.log(' [*] Waiting for logs. To exit press CTRL+C');
      console.log('===q=', q)
      args.forEach(v => {
        ch.bindQueue(q.queue, ex, v)
      })
      console.log('queue', q.queue)
      ch.consume(q.queue, (msg) => { console.log('[x] "%s": "%s"', msg.fields.routingKey, msg.content.toString()) }, {noAck: true})
    })
  })
})