const amqp = require('amqplib/callback_api');
const url = 'amqp://39.108.184.93'

function getInfo() {
  return {
    code: '000000',
    status: 'success',
    list: [
      {
        user: 'aa',
        customerId: 'aaa'
      }
    ]
  };
}

amqp.connect(url, (err, conn) => {
  conn.createChannel((er, ch) => {
    const ex = 'wkToLCRM-getCustomerInfo'
    const msg = JSON.stringify(getInfo());
    const serverity = 'info'

    ch.assertExchange(ex, 'direct', {durable: true});
    // ch.publish('amq.topic', 'whatever', Buffer.from('blah'), {}, mkCallback(i));
    // 交换器 路由参数 消息
    ch.publish(ex, serverity, new Buffer(msg));

    console.log(" [x] Sent %s: '%s'", serverity, msg);
  })
})